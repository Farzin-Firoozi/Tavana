
#ifndef GIAHINO_DEV_SIM800MODULE_H
#define GIAHINO_DEV_SIM800MODULE_H

#include "module.h"
#include "log.h"
#include "Arduino.h"
#include "SoftwareSerial.h"

class Sim800Module : public Module {
    uint8_t pinTx;
    uint8_t pinRx;
    SoftwareSerial *mySerial = nullptr;
    String chatId = "";
    unsigned long int lastLoopTime;
public:

    Sim800Module(String id, bool active, uint8_t tx, uint8_t rx) : Module(id, active), pinRx(rx),
                                                                   pinTx(tx) {
        mySerial = new SoftwareSerial(rx, tx);
    }

    void setup() override {
        mySerial->begin(9600);
        Serial.println("Initializing...");
        delay(1000);
        mySerial->println("AT");
        delay(500);
        updateSerial();
        lastLoopTime = millis();
        this->setIsSetuped(true);
    }

    void loop() override {
        if (!getIsSetuped()) {
            this->setup();
            return;
        }
        auto t = millis();
        if (t - lastLoopTime < 500) {
            return;
        }
        lastLoopTime = t;
        bool available = mySerial->available();
        if(available) {
            logLine("HandleSim800 Start");
        }
        auto shouldSend = false;
        String message = "";
        while (mySerial->available()) {
            shouldSend = true;
            message += mySerial->readString() + "\n";
        }
        if (shouldSend && message.length() > 0 && !this->chatId.isEmpty()) {
            StaticJsonDocument<200> doc;
            doc["type"] = OUTPUT_TYPE;
            auto val = doc.createNestedObject("value");
            val["chat_id"] = this->chatId;
            val["message"] = message;
            val["id"] = this->getId();
            this->sendMessage(doc);
        }
        if(available) {
            logLine("HandleSim800 End");
        }

    }

    void updateSerial()
    {
        while(mySerial->available())
        {
            Serial.write(mySerial->read());//Forward what Software Serial received to Serial Port
        }
    }

    void inputMessage(String message) {
        if(message.endsWith("END;")) {
            Serial.println("{END} Input Message:" + message);
            auto msg = message.substring(0, message.length() - 4);
            Serial.println("{END} Input MSG:" + msg);
            mySerial->print(msg.c_str());
            mySerial->write(26);
//            updateSerial();
//            mySerial->println("AT");
//            delay(500);
//            updateSerial();
            return;
        }else {
            Serial.println("Input Message:" + message);
            mySerial->println(message.c_str());
        }

    }

    String getChatId() const {
        return chatId;
    }

    void setChatId(String chatId) {
        Sim800Module::chatId = chatId;
    }

    void destruct() override {
        const auto id = this->getId();
        delete mySerial;
        mySerial = nullptr;
        Serial.printf(PSTR("Sim800 Module Destroyed on RxPin %d, TxPin %d with ID: %s\n"), pinRx, pinTx, id.c_str());

    }
};

#endif //GIAHINO_DEV_SIM800MODULE_H
