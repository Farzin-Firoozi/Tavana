//
// Created by shirejoni on 7/6/22.
//

#ifndef GIAHINO_DEV_RelayModule_H
#define GIAHINO_DEV_RelayModule_H

#include "Arduino.h"
#include "module.h"
#include "log.h"



const auto PIN_OFF = HIGH;
const auto PIN_ON = LOW;

class RelayModule : public Module {
    uint8_t pin;
public:
    RelayModule(String id, bool active, uint8_t p) : Module(id, active), pin(p) {}

    virtual void setup() {
        Serial.printf(PSTR("Setup Relay Start ===============\n"));
        Serial.printf(PSTR("RelayModule Set PinMode Output for pin %d\n"), pin);
        pinMode(pin, OUTPUT);
        if(active) {
            this->setPinOn();
        }else {
            this->setPinOff();
        }
        this->setIsSetuped(true);
        Serial.printf(PSTR("Setup Relay End ===============\n"));
    }

    virtual void loop() {
        if (!getIsSetuped()) {
            this->setup();
        }

    }

    uint8_t getPin() {
        return pin;
    }

    void setPinOn() {
        Serial.printf(PSTR("RelayModule digitalWrite pin %d LED_ON\n"), pin);
        digitalWrite(pin, LED_ON);
    }

    void setPinOff() {
        Serial.printf(PSTR("RelayModule digitalWrite pin %d LED_OFF\n"), pin);
        digitalWrite(pin, LED_OFF);
    }

    virtual void destruct() {
        pinMode(pin, INPUT);
        const auto id = this->getId();
        Serial.printf(PSTR("Relay Module Destroyed on Pin %d with ID: %s\n"), pin, id.c_str());
    }
};

#endif //GIAHINO_DEV_RelayModule_H
