//
// Created by shirejoni on 7/6/22.
//

#ifndef GIAHINO_DEV_DHT11MODULE_H
#define GIAHINO_DEV_DHT11MODULE_H

#include "module.h"
#include "log.h"
#include <DHT.h>
#include <DHT_U.h>
#include "Arduino.h"
#include "ArduinoJson.h"
#include "messageTypes.h"

#define DHTTYPE DHT11

class DHT11Module : public Module {
    DHT_Unified* dht;
    uint8_t pin;
    unsigned long int dhtLastActivityTime;
public:
    DHT11Module(String id, bool active, uint8_t p) : Module(id, active), pin(p) {}

    virtual void setup() {
        // Setup DHT11
        dht = new DHT_Unified(pin, DHTTYPE);
        dht->begin();
        Serial.printf(PSTR("DHT11 Setup On Pin %d With ID %s\n"), pin, this->getId().c_str());
        // Print temperature sensor details.
        sensor_t sensor;
        dht->temperature().getSensor(&sensor);
        Serial.println(F("------------------------------------"));
        Serial.println(F("Temperature Sensor"));
        Serial.print(F("Sensor Type: "));
        Serial.println(sensor.name);
        Serial.print(F("Driver Ver:  "));
        Serial.println(sensor.version);
        Serial.print(F("Unique ID:   "));
        Serial.println(sensor.sensor_id);
        Serial.print(F("Max Value:   "));
        Serial.print(sensor.max_value);
        Serial.println(F("°C"));
        Serial.print(F("Min Value:   "));
        Serial.print(sensor.min_value);
        Serial.println(F("°C"));
        Serial.print(F("Resolution:  "));
        Serial.print(sensor.resolution);
        Serial.println(F("°C"));
        Serial.println(F("------------------------------------"));
        // Print humidity sensor details.
        dht->humidity().getSensor(&sensor);
        Serial.println(F("Humidity Sensor"));
        Serial.print(F("Sensor Type: "));
        Serial.println(sensor.name);
        Serial.print(F("Driver Ver:  "));
        Serial.println(sensor.version);
        Serial.print(F("Unique ID:   "));
        Serial.println(sensor.sensor_id);
        Serial.print(F("Max Value:   "));
        Serial.print(sensor.max_value);
        Serial.println(F("%"));
        Serial.print(F("Min Value:   "));
        Serial.print(sensor.min_value);
        Serial.println(F("%"));
        Serial.print(F("Resolution:  "));
        Serial.print(sensor.resolution);
        Serial.println(F("%"));
        Serial.println(F("------------------------------------"));
        // Set delay between sensor readings based on sensor details.
        auto dhtDelayMS = sensor.min_delay / 1000;
        this->minimumDuration = dhtDelayMS;
        this->sampleDuration = this->sampleDuration >= dhtDelayMS ? this->sampleDuration : dhtDelayMS;
        dhtLastActivityTime = millis();

        Serial.printf(PSTR("DHT11 Setup completed On Pin %d width Id %s\n"), pin, this->getId().c_str());
        this->setIsSetuped(true);
    }

    virtual void loop() {
        if (!getIsSetuped()) {
            this->setup();
        }
        auto t = millis();
        if (t - dhtLastActivityTime < this->sampleDuration) {
            return;
        }
        dhtLastActivityTime = t;
        if (!isActive()) {
            Serial.printf(PSTR("DHT11 On Pin %d Width ID %s is InActive\n"), pin, this->getId().c_str());
            return;
        }
        logLine("HandleDHT Start");
        Serial.printf(PSTR("Loop DHT11 On Pin %d Width ID %s\n"), pin, this->getId().c_str());
        Serial.println(F("Getting DHT Value Stating..."));
        bool error = false;
        sensors_event_t tEvent;
        dht->temperature().getEvent(&tEvent);
        if (isnan(tEvent.temperature)) {
            error = true;
            Serial.println(F("Error reading temperature!"));
        } else {
            Serial.print(F("Temperature: "));
            Serial.print(tEvent.temperature);
            Serial.println(F("°C"));
        }
        // Get humidity event and print its value.
        sensors_event_t hEvent;
        dht->humidity().getEvent(&hEvent);
        if (isnan(hEvent.relative_humidity)) {
            error = true;
            Serial.println(F("Error reading humidity!"));
        } else {
            Serial.print(F("Humidity: "));
            Serial.print(hEvent.relative_humidity);
            Serial.println(F("%"));
        }
        if(!error) {
            StaticJsonDocument<200> doc;
            doc["type"] = VALUE;
            doc["id"] = this->getId();
            JsonArray docData = doc.createNestedArray("data");
            docData.add(tEvent.temperature);
            docData.add(hEvent.relative_humidity);
//            doc.garbageCollect();
            this->sendMessage(doc);
        }

        logLine("HandleDHT End");

    }

    virtual void destruct() {
        const auto id = this->getId();
        delete dht;
        dht = nullptr;
        Serial.printf(PSTR("DHT Module Destroyed on Pin %d with ID: %s\n"), pin, id.c_str());
    }
};

#endif //GIAHINO_DEV_DHT11MODULE_H
