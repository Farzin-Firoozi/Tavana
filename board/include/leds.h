//
// Created by shirejoni on 6/3/22.
//

#ifndef GIAHINO_DEV_LEDS_H
#define GIAHINO_DEV_LEDS_H

#include <pins_arduino.h>
#include <Arduino.h>

const auto FIRST_LED = D1;
const auto SECOND_LED = D2;
const auto LED_OFF = HIGH;
const auto LED_ON = LOW;

void setLed(uint8_t pin, uint8_t val) {
    digitalWrite(pin, val);

}

void setLedOn(uint8_t pin) {
    setLed(pin, LED_ON);
}

void setLedOff(uint8_t pin) {
    setLed(pin, LED_OFF);
}


bool isLedOn(uint8_t pin) {
    return digitalRead(pin) == LED_ON;
}

bool isLedOff(uint8_t pin) {
    return digitalRead(pin) == LED_OFF;
}


#endif //GIAHINO_DEV_LEDS_H
