//
// Created by shirejoni on 7/1/22.
//

#ifndef GIAHINO_DEV_HANDLER_H
#define GIAHINO_DEV_HANDLER_H

#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <PubSubClient.h>
#include "AsyncDelay.h"
#include "ArduinoJson.h"
#include <StreamUtils.h>
#include "log.h"
#include <LinkedList.h>
#include "module.h"
#include "DHT11Module.h"
#include "Sim800Module.h"
#include "RelayModule.h"
#include "messageTypes.h"
#include "connection.h"

// MQTT

AsyncDelay mqttConnectionDelay;
unsigned long messageIndex = 0;


enum ConnectStatus {
    ConnectedAlready = 0,
    ConnectedSuccessFully = 1,
    ConnectedFailed = 2,
};

LinkedList<Module *> modules = LinkedList<Module *>();


struct SensorItem {
    String id;
    String model;
    String pins[5];
    int pinSize;
    bool active;
    int sampleDuration;
};

struct SetItem {
    String id;
    bool set;
};

bool sensorItemsContain(const String &targetId, SensorItem *items, int itemsSize) {
    for (int i = 0; i < itemsSize; i++) {
        if (targetId.equals(items[i].id)) {
            return true;
        }
    }
    return false;
}


class MqttHandler {

public:
    void sendMessage(String &topic, const JsonDocument &doc) {
        pubSubClient.beginPublish(topic.c_str(), measureJson(doc), false);
        BufferingPrint bufferedClient(pubSubClient, 32);
        serializeJson(doc, bufferedClient);
        bufferedClient.flush();
        pubSubClient.endPublish();
    }


    void handle(char *topic, byte *payload, unsigned int length) {
        auto input = String((char *) payload).substring(0, length);
        StaticJsonDocument<2048> message;
        deserializeJson(message, input);
        String type = message["type"];
        Serial.printf(PSTR("Message Type %s\n"), type.c_str());
        if (type.equals(PINS)) {
            JsonArray sensors = message["value"];
            updatePins(sensors);
        } else if (type.equals(ACTION)) {
            JsonArray sets = message["value"];
            setRelays(sets);
        } else if (type.equals(INPUT_TYPE)) {
            JsonObject sets = message["value"];
            inputMessage(sets);
        }
    }

    void subscribeToBroker(String topic, bool isReconnect = false) {
        Serial.printf(PSTR("Subscribe to Topic %s\n"), topic.c_str());
        pubSubClient.subscribe(topic.c_str());
        StaticJsonDocument<25> doc;
        doc["type"] = isReconnect ? "Sensors_request" : "Sensors_request";
        sendMessage(topic, doc);
    }

    ConnectStatus connect(String token, String macaddress) {
        String clientId = "GC-"; // Giahino Client
        clientId += String(random(0xffff), HEX);
        Serial.printf(PSTR("connection function: \n username: %s\n password: %s\n"), macaddress.c_str(), token.c_str());
        if (pubSubClient.connect(clientId.c_str(), macaddress.c_str(), token.c_str())) {
            Serial.println(F("connected"));
            return ConnectedSuccessFully;

        }
        return ConnectedFailed;
    }

    ConnectStatus reconnect(String token, String macaddress) {
        if (!pubSubClient.connected()) {
            Serial.println(F("Attempting MQTT Connection..."));
            return connect(token, macaddress);
        }
        return ConnectedAlready;
    }

    void updatePins(JsonArray &sensors) {
        SensorItem sensorItems[sensors.size()];
        auto sensorITemsSize = sensors.size();
        for (int i = 0; i < sensors.size(); i++) {
            JsonObject sensor = sensors[i];
            sensorItems[i].id = String(sensor["id"]);
            sensorItems[i].model = String(sensor["name"]);
            sensorItems[i].active = sensor["active"];
            sensorItems[i].sampleDuration = sensor["sampleDuration"];
            JsonArray pins = sensor["pins"];
            for (int j = 0; j < pins.size(); j++) {
                sensorItems[i].pins[j] = String(pins[j]);
            }
        }
        for (int i = 0; i < modules.size(); i++) {
            auto prevModule = modules.get(i);
            if (!sensorItemsContain(prevModule->getId(), sensorItems, sensorITemsSize)) {
                const auto id = prevModule->getId();
                Serial.printf(PSTR("Should Module Delete %s\n"), id.c_str());
                prevModule->destruct();
                modules.remove(i);
            }
        }
        for (int i = 0; i < sensorITemsSize; i++) {
            auto sensorItem = sensorItems[i];
            bool find = false;
            int j = 0;
            for (; j < modules.size(); j++) {
                if (sensorItem.id.equals(modules.get(j)->getId())) {
                    find = true;
                    break;
                }
            }
            if (!find) {
                Module *module;
                if (sensorItem.model.equals(ModelDHT)) {
                    auto pin = uint8_t(sensorItem.pins[0].toInt());
                    module = new DHT11Module(sensorItem.id, sensorItem.active, pin);
                    Serial.printf(PSTR("DHTModule Added To Modules id: %s, active: %s, pin: %d\n"),
                                  sensorItem.id.c_str(),
                                  sensorItem.active ? "true" : "false", pin);
                }else if (sensorItem.model.equals(ModelSim800)) {
                    auto tx = uint8_t(sensorItem.pins[0].toInt());
                    auto rx = uint8_t(sensorItem.pins[1].toInt());
                    module = new Sim800Module(sensorItem.id, sensorItem.active, tx, rx);
                    Serial.printf(PSTR("Sim800Module Added To Modules id: %s, active: %s, pin Rx: %d, pin Tx: %d\n"),
                                  sensorItem.id.c_str(),
                                  sensorItem.active ? "true" : "false", rx, tx);
                } else if (sensorItem.model.equals(ModelRelay)) {
                    auto pin = uint8_t(sensorItem.pins[0].toInt());
                    module = new RelayModule(sensorItem.id, sensorItem.active, pin);
                    Serial.printf(PSTR("RelayModule Added To Modules id: %s, active: %s, pin: %d\n"),
                                  sensorItem.id.c_str(),
                                  sensorItem.active ? "true" : "false", pin);
                } else {
                    Serial.printf(PSTR("Module Model Doesn't Recognized %s\n"), sensorItem.model.c_str());
                    continue;
                }
                if (module != nullptr) {
                    modules.add(module);
                }
            } else {
                auto module = modules.get(j);
                if (sensorItem.active != module->isActive()) {
                    module->setActive(sensorItem.active);
                }
                if (sensorItem.active != module->isActive()) {
                    module->setActive(sensorItem.active);
                }
                auto duration = (uint32_t) sensorItem.sampleDuration;
                if (duration != module->getSampleDuration()) {
                    module->setSampleDuration(duration);
                }
            }
        }
    }

    void setRelays(JsonArray &sets) {
        SetItem setItems[sets.size()];
        auto setItemsSize = sets.size();
        for (int i = 0; i < sets.size(); i++) {
            JsonObject set = sets[i];
            setItems[i].id = String(set["id"]);
            setItems[i].set = set["set"];
        }

        for (int i = 0; i < setItemsSize; i++) {
            auto setItem = setItems[i];
            for (int j = 0; j < modules.size(); j++) {
                auto moduleID = modules.get(j)->getId();
                auto i = moduleID.lastIndexOf("_");
                moduleID = moduleID.substring(0, i);
                if (setItem.id.equals(moduleID)) {
                    auto module = modules.get(j);
                    if (setItem.set) {
                        Serial.printf("Set Module %s Pin %d On\n", module->getId().c_str(),
                                      ((RelayModule *) module)->getPin());
                        ((RelayModule *) module)->setPinOn();
                    } else {
                        Serial.printf("Set Module %s Pin %d OFF\n", module->getId().c_str(),
                                      ((RelayModule *) module)->getPin());
                        ((RelayModule *) module)->setPinOff();
                    }
                    break;
                }
            }

        }
    }

    void inputMessage(JsonObject &input) {
        auto chatId = String(input["chat_id"]);
        auto message = String(input["message"]);
        auto id = String(input["id"]);
        int j = 0;
        for (; j < modules.size(); j++) {
            auto moduleID = modules.get(j)->getId();
            auto i = moduleID.lastIndexOf("_");
            moduleID = moduleID.substring(0, i);
            if (id.equals(moduleID)) {
                auto module = modules.get(j);
                Serial.printf("Send Input Message for Module %s Message %s \n", module->getId().c_str(),
                              message.c_str());
                ((Sim800Module *) module)->setChatId(chatId);
                ((Sim800Module *) module)->inputMessage(message);
                break;
            }
        }
    }


    void loop() {
        for (int j = 0; j < modules.size(); j++) {
            auto module = modules.get(j);
            module->loop();
        }

    }

};

#endif //GIAHINO_DEV_HANDLER_H
