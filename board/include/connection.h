//
// Created by shirejoni on 7/18/22.
//

#ifndef GIAHINO_DEV_CONNECTION_H
#define GIAHINO_DEV_CONNECTION_H

#include <ESP8266WiFi.h>
#include <PubSubClient.h>

WiFiClient espClient;
PubSubClient pubSubClient(espClient);

#endif //GIAHINO_DEV_CONNECTION_H
