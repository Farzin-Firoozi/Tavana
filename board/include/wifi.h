//
// Created by shirejoni on 6/14/22.
//

#ifndef GIAHINO_DEV_WIFI_H
#define GIAHINO_DEV_WIFI_H

#include <Arduino.h>
#include "storage.h"
#include "log.h"
#include "AsyncDelay.h"
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <uri/UriBraces.h>
#include "template.h"

const int RSSI_MAX = -50;
const int RSSI_MIN = -100;
#ifndef APSSID
#define APSSID "TavanaDev"
#define APPAS "123456789"
#endif

/* Set these to your desired credentials. */
const char *aPSSID = APSSID;
const char *aPPAS = APPAS;
int wifiesSize = 0;
bool isConnecting = false;
AsyncDelay wifiConnectingDelay;
String targetSSID;
String targetPassword;

struct WiFiRssi {
    int i;
    int32_t rssi;
};

WiFiRssi wifies[5];

bool compareWiFiRssi(WiFiRssi a, WiFiRssi b) {
    return a.rssi < b.rssi;
}

ESP8266WebServer server(80);

int dBmtoPercentage(int dBm) {
    int quality;
    if (dBm <= RSSI_MIN) {
        quality = 0;
    } else if (dBm >= RSSI_MAX) {
        quality = 100;
    } else {
        quality = 2 * (dBm + 100);
    }

    return quality;
}


// Access Point
int scanNetworks() {
    String ssid;
    int32_t rssi;
    uint8_t encryptionType;
    uint8_t *bssid;
    int32_t channel;
    bool hidden;
    wifiesSize = WiFi.scanNetworks(false, true);
    wifiesSize = wifiesSize < 10 ? wifiesSize : 10;
    for (int i = 0; i < wifiesSize; i++) {
        WiFiRssi item;
        WiFi.getNetworkInfo(i, ssid, encryptionType, rssi, bssid, channel, hidden);
        item.i = i;
        item.rssi = rssi;
        wifies[i] = item;
    }
    return wifiesSize;
}

void sortNetworks() {
    int n = sizeof(wifies) / sizeof(wifies[0]);
    std::sort(wifies, wifies + n, compareWiFiRssi);
}

void printNetworks() {
    String ssid;
    int32_t rssi;
    uint8_t encryptionType;
    uint8_t *bssid;
    int32_t channel;
    bool hidden;
    for (int i = 0; i < wifiesSize; i++) {
        auto j = wifies[i].i;
        WiFi.getNetworkInfo(j, ssid, encryptionType, rssi, bssid, channel, hidden);
        Serial.printf(PSTR("  %02d: [CH %02d] [%02X:%02X:%02X:%02X:%02X:%02X] %ddBm %c %c %s quality:%d\n"), j, channel, bssid[0],
                      bssid[1], bssid[2], bssid[3], bssid[4], bssid[5], rssi,
                      (encryptionType == ENC_TYPE_NONE) ? ' ' : '*', hidden ? 'H' : 'V', ssid.c_str(), dBmtoPercentage(rssi));
    }
}

void initialSAP() {
    Serial.println("initial Soft Access Point");
    delay(10);

    WiFi.softAP(aPSSID, aPPAS);
    IPAddress myIP = WiFi.softAPIP();
    Serial.println("Soft Access Point created");
    Serial.printf("SSID = %s, PASSWORD = %s\n", aPSSID, aPPAS);
    Serial.print("AP IP address: ");
    Serial.println(myIP);

}

// WiFI
WiFiEventHandler gotIpEventHandler;
bool isWifiConnected() {
    return WiFi.status() == WL_CONNECTED;
}

void handleOnWiFiConnected(const WiFiEventStationModeGotIP& event) {
    isConnecting = false;
    Serial.println("Wifi Connected IP:");
    Serial.println(WiFi.localIP());
    auto storage = Storage::GetInstance();
    auto EEPROM_SSID = storage->getSsid();
    auto EEPROM_PASSWORD = storage->getPassword();
    bool isChange = false;

    if(WiFi.SSID() != EEPROM_SSID) {
        isChange = true;
        storage->setSsid(WiFi.SSID());
        storage->setPassword(targetPassword);
    }else if(targetPassword != EEPROM_PASSWORD) {
        isChange = true;
        storage->setPassword(targetPassword);
    }
    if(isChange) {
        storage->save(true);
    }
}

void connectToWifi(String ssid, String password = "") {
    Serial.printf(PSTR("connectToWifi %s %s\n"), ssid.c_str(), password.c_str());
    targetSSID = ssid;
    targetPassword = password;
    isConnecting = true;
    WiFi.disconnect();
    Serial.println("Previous WiFi Disconnected");
    wifiConnectingDelay.start(10000, AsyncDelay::MILLIS);
    WiFi.begin(ssid, password);
    WiFi.setAutoReconnect(true);
    WiFi.persistent(true);
}

void initialWiFi() {
    Serial.println("initial wifi");
    auto storage = Storage::GetInstance();
    if(!storage->getIsInit()) {
        storage->init();
    }
    auto EEPROM_SSID = storage->getSsid();
    auto EEPROM_PASSWORD = storage->getPassword();
    Serial.printf(PSTR("Storage WIFI, ssid:%s, password:%s\n"), EEPROM_SSID.c_str(), EEPROM_PASSWORD.c_str());
    WiFi.disconnect();
    gotIpEventHandler = WiFi.onStationModeGotIP(handleOnWiFiConnected);
    auto result = scanNetworks();
    Serial.printf("%d Networks found\n", result);
    Serial.printf("Sorted Networks List\n");
    if (result > 1) {
        sortNetworks();
    }
    printNetworks();
    if(EEPROM_SSID.length() > 0) {
        connectToWifi(EEPROM_SSID, EEPROM_PASSWORD);
    }
}

void handleWifi() {


    if(isConnecting && wifiConnectingDelay.isExpired()) {
        Serial.println(F("Wifi Connecting Expired"));
        isConnecting = false;
        if(!isWifiConnected()) {
            WiFi.disconnect();
        }
    }
}

// WebServer
void handleWiFiPage() {
    server.send(200, "text/html", WifiPage);
}

void handleConnectionList() {
    String result;
    String ssid;
    int32_t rssi;
    uint8_t encryptionType;
    uint8_t *bssid;
    int32_t channel;
    bool hidden;
    scanNetworks();
    for (int i = 0; i < wifiesSize; i++) {
        auto j = wifies[i].i;
        WiFi.getNetworkInfo(j, ssid, encryptionType, rssi, bssid, channel, hidden);
        result += ssid + ",";
        result += encryptionType == ENC_TYPE_NONE ? "0," : "1,";
        result += hidden ? "1," : "0,";
        result += String(dBmtoPercentage(rssi)) + "\n";
    }
    server.send(200, F("text/plain"), result);
}

void handleConnectionStatus() {
    if(isWifiConnected()) {
        auto ssid = WiFi.SSID();
        server.send(200, F("text/plain"), "0," + ssid);
    }else {
        server.send(200, F("text/plain"), isConnecting ? "1," + targetSSID : "0");
    }
}

void handleConnectionConnect() {
    Serial.println(F("handleConnectionConnect"));
    server.send(200, "text/plain");
    connectToWifi(server.pathArg(0), server.pathArg(1));
}

void handleConnectionWithSSIDConnect() {
    Serial.println(F("handleConnectionConnect"));
    server.send(200, "text/plain");
    connectToWifi(server.pathArg(0));

}

#endif //GIAHINO_DEV_WIFI_H
