//
// Created by shirejoni on 7/6/22.
//

#ifndef GIAHINO_DEV_MODULE_H
#define GIAHINO_DEV_MODULE_H

#include "Arduino.h"
#include "PubSubClient.h"
#include "ArduinoJson.h"
#include "connection.h"
#include "StreamUtils.h"
#include "storage.h"

class Module {
protected:
    String id;
    bool isSetuped = false;
    bool active;
    uint32_t sampleDuration = 3000;
    uint32_t minimumDuration = 1;
    PubSubClient client;
public:

    Module(String id, bool active) : id(id), active(active), client(client) {}

    virtual void setup() = 0;

    virtual void loop() = 0;

    virtual void destruct() = 0;

    void setActive(bool a) { active = a; }

    void setSampleDuration(uint32_t v) {
        if (v >= minimumDuration) {
            sampleDuration = v;
        }
    }

    uint32_t getSampleDuration() { return sampleDuration; }


    bool isActive() { return active; }

    String getId() const {
        return id;
    }

    void setId(String id) {
        Module::id = id;
    }

    bool getIsSetuped() const {
        return isSetuped;
    }

    void setIsSetuped(bool isSetuped) {
        Module::isSetuped = isSetuped;
    }


    void sendMessage(const JsonDocument &doc) {
        Serial.println("Send Message");
        auto topic = WiFi.macAddress();
        topic.replace(":", "");
//        auto storage = Storage::GetInstance();
//        auto token = storage->getToken();
        pubSubClient.beginPublish(topic.c_str(), measureJson(doc), false);
        BufferingPrint bufferedClient(pubSubClient, 32);
        serializeJson(doc, bufferedClient);
        bufferedClient.flush();
        pubSubClient.endPublish();
    }

};

#endif //GIAHINO_DEV_MODULE_H
