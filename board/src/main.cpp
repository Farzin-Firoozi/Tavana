#include <Arduino.h>

#include <Adafruit_Sensor.h>

#include "LittleFS.h"
#include "leds.h"
#include "log.h"
#include "wifi.h"
#include "handler.h"
#include "connection.h"
#include "ElegantOTA.h"

auto MQTT_SERVER = String("37.32.29.38");
// docker run -d --name some-rabbit -p 1883:1883 -p 15672:15672 rabbitmq:3-management

enum ApplicationStatus {
    ApplicationInitial,
    ApplicationReading
};

enum TokenStatus {
    TokenInitial,
    TokenLoading,
    TokenLoggedIn,
    TokenError
};

TokenStatus tokenStatus = TokenInitial;
ApplicationStatus applicationStatus = ApplicationInitial;
bool shouldInitialConnect = false;
MqttHandler handler;

void MQTT_subscriberCallback(char *topic, byte *payload, unsigned int length) {
    char lineTitle[50];
    messageIndex++;
    sprintf(lineTitle, PSTR("Message Received From Topic %s: #%lu"), topic, messageIndex);
    logLine(lineTitle);
    handler.handle(topic, payload, length);
}


void handleTokenStatus() {
    Serial.println(F("HandleTokenStatus connection"));
    switch (tokenStatus) {
        case TokenInitial:
            server.send(200, F("text/plain"), "false");
            break;
        case TokenLoading:
            server.send(200, F("text/plain"), "loading");
            break;
        case TokenLoggedIn:
            server.send(200, F("text/plain"), "true");
            break;
        case TokenError:
            server.send(200, F("text/plain"), "error");
            break;
    }
    server.send(200, F("text/plain"), "loading");
}

void handleTokenLogin() {
    auto token = server.pathArg(0);
    Serial.printf(PSTR("handleTokenLogin token: %s"), token.c_str());
    tokenStatus = TokenLoading;
    server.send(200, F("text/plain"), "loading");
    auto macAdress = WiFi.macAddress();
    macAdress.replace(":", "");
    auto result = handler.connect(token, macAdress);
    if (result == ConnectedSuccessFully) {
        Serial.println(F("handleTokenLogin: connection sucessfully"));
        auto storage = Storage::GetInstance();
        storage->setToken(token);
        storage->save(true);
        tokenStatus = TokenLoggedIn;
        handler.subscribeToBroker(macAdress);

    } else {
        tokenStatus = TokenError;
        Serial.println(F("handleTokenLogin: connection failed"));
    }
}

void handleTokenLogout() {
    pubSubClient.disconnect();
    tokenStatus = TokenInitial;
    Serial.println(F("logout successfully"));
    auto storage = Storage::GetInstance();
    auto token = storage->getToken();
    storage->setToken("");
    storage->save(true);
    server.send(200, F("text/plain"), "false");
}

void handleRoot() {
    server.send(200, "text/html", IndexPage);
}


void handleTokenPage() {
    server.send(200, "text/html", TokenPage);
}


void initialWebServer() {

    // Root Page
    server.on("/", handleRoot);

    // Network Page
    server.on("/connection", handleWiFiPage);
    server.on("/connection/status", handleConnectionStatus);
    server.on("/connection/list", handleConnectionList);
    server.on(UriBraces("/connection/connect/{}/{}"), handleConnectionConnect);
    server.on(UriBraces("/connection/connect/{}"), handleConnectionWithSSIDConnect);

    // Token Page
    server.on("/token", handleTokenPage);
    server.on("/token/status", handleTokenStatus);
    server.on("/token/logout", handleTokenLogout);
    server.on(UriBraces("/token/login/{}"), handleTokenLogin);

    // Ota Page
    ElegantOTA.begin(&server);

    server.begin();
    Serial.println("HTTP server started");
}

void setup() {
// write your initialization code here

    // Initialize LED
//    pinMode(LED_BUILTIN, OUTPUT);
//    pinMode(FIRST_LED, OUTPUT);
//    pinMode(SECOND_LED, OUTPUT);
//    setLed(FIRST_LED, LED_OFF);
//    setLed(SECOND_LED, LED_OFF);
//    setLed(LED_BUILTIN, LED_OFF);

    // Set Baud Rate
    Serial.begin(9600);
    EEPROM.begin(512);
    // First Delay for monitoring
    delay(1000);
    Serial.println();
    Serial.println(F("Giahino Stating..."));
    logLine("Setup Start");

    // Seed Random
    randomSeed(micros());

    logSection("Setup LittleFS");
    if (!LittleFS.begin()) {
        Serial.println(F("An Error has occurred while mounting LittleFS"));
        return;
    }


    // Setup Initial Wifi
    logSection("Setup Wifi");
    Serial.print(F("ESP Board Mac Address: "));
    Serial.println(WiFi.macAddress());
    initialSAP();
    initialWiFi();
    initialWebServer();



    auto storage = Storage::GetInstance();
    auto token = storage->getToken();
    Serial.println("Token Found" + token);
    logSection("MQTT");
    // Setup MQTT
    pubSubClient.setServer(MQTT_SERVER.c_str(), 1883);
    Serial.println("MQTT SetServer Location: " + MQTT_SERVER);
    pubSubClient.setCallback(MQTT_subscriberCallback);
    Serial.println(F("MQTT SetSubscriber Callback"));
    tokenStatus = TokenInitial;

    if (token.length() > 0) {
        Serial.println(F("Initial Token Found Will Be Connect When Wifi Connected"));
        shouldInitialConnect = true;
    }




    logLine("Setup End");
}


void handleMQTT() {
    if(shouldInitialConnect || (!pubSubClient.connected() && tokenStatus == TokenLoggedIn)) {
        if (mqttConnectionDelay.isExpired()) {
            auto storage = Storage::GetInstance();
            auto token = storage->getToken();
            auto macAddress = WiFi.macAddress();
            macAddress.replace(":", "");
            ConnectStatus result;
            if (shouldInitialConnect) {
                if(!WiFi.isConnected()) {
                    return;
                }
                result = handler.connect(token, macAddress);
            } else {
                result = handler.reconnect(token, macAddress);
            }
            if (result == ConnectedSuccessFully) {
                tokenStatus = TokenLoggedIn;
                handler.subscribeToBroker(macAddress, !shouldInitialConnect);
                shouldInitialConnect = false;
            } else {
                mqttConnectionDelay.start(3000, AsyncDelay::MILLIS);
            }

        }
    }
    pubSubClient.loop();
}


void loop() {
    server.handleClient();
    handleWifi();
    handleMQTT();
    handler.loop();
}



