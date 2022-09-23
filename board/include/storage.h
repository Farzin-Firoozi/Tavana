//
// Created by shirejoni on 6/17/22.
//

#ifndef GIAHINO_DEV_STORAGE_H
#define GIAHINO_DEV_STORAGE_H

#include <Arduino.h>
#include <EEPROM.h>

const int PREFIX_LENGTH PROGMEM = 5;
const int PREFIX_ADDRESS PROGMEM = 0;
const int SSID_ADDRESS PROGMEM = PREFIX_ADDRESS + 100;
const int PASSWORD_ADDRESS PROGMEM = SSID_ADDRESS + 100;
const int TOKEN_ADDRESS PROGMEM = PASSWORD_ADDRESS + 100;

class Storage {
private:
    bool isInit = false;
    String password;
    String token;

    Storage() {}
    String ssid;
public:
    static Storage *instance;

    bool getIsInit() const {
        return isInit;
    }
    const String &getSsid() const {
        if(!isInit) {
            ::init();
        }
        return ssid;
    }

    void setSsid(const String &ssid) {
        if(!isInit) {
            ::init();
        }
        Storage::ssid = ssid;
    }

    const String &getPassword() const {
        if(!isInit) {
            ::init();
        }
        return password;
    }

    void setPassword(const String &password) {
        if(!isInit) {
            ::init();
        }
        Storage::password = password;
    }

    const String &getToken() const {
        if(!isInit) {
            ::init();
        }
        return token;
    }

    void setToken(const String &token) {
        if(!isInit) {
            ::init();
        }
        Storage::token = token;
    }

    static Storage *GetInstance() {
        if(instance == nullptr) {
            instance = new Storage();
        }
        return instance;
    }

    void init() {
        if(isInit) {
            return;
        }
        Serial.println(F("Storage EEPROM Initilized"));
        isInit = true;
        String prefix;
        readString(PREFIX_ADDRESS, &prefix, PREFIX_LENGTH);
        if (prefix != "clear") {
            clear();
            prefix = "clear";
            writeString(PREFIX_ADDRESS, prefix, true);
            EEPROM.commit();
        }
        readString(SSID_ADDRESS, &ssid);
        readString(PASSWORD_ADDRESS, &password);
        readString(TOKEN_ADDRESS, &token);

    }

    void clear() {
        Serial.println(F("Storage EEPROM Clearing..."));
        for (int i = 0; i < EEPROM.length(); i++) {
            EEPROM.write(i, 0);
        }
        Serial.println(F("Storage EEPROM Cleared"));
    }

    void readString(int address, String *strToRead, int length = 0) {
        int offset = 0;

        if (length == 0) {
            length = EEPROM.read(address);
            offset = 1;
        }
        char data[length + 1];
        for (int i = 0; i < length; i++) {
            data[i] = EEPROM.read(address + i + offset);
        }
        data[length] = '\0';
        *strToRead = String(data);
    }

    int writeString(int address, String &strToWrite, bool preventWriteLength = false) {
        int offset = 0;
        byte len = strToWrite.length();
        if (!preventWriteLength) {
            offset = 1;
            EEPROM.write(address, len);
        }
        for (int i = 0; i < len; i++) {
            EEPROM.write(address + offset + i, strToWrite[i]);
        }
        return len;
    }

    void save(bool commit = false) {
        Serial.println("write data ssid, password");
        writeString(SSID_ADDRESS, ssid);
        writeString(PASSWORD_ADDRESS, password);
        writeString(TOKEN_ADDRESS, token);
        if(commit) {
            Serial.println("commited");
            EEPROM.commit();
        }
    }
};

Storage* Storage::instance = nullptr;

#endif //GIAHINO_DEV_STORAGE_H
