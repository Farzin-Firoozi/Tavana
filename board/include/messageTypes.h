//
// Created by shirejoni on 7/16/22.
//

#ifndef GIAHINO_DEV_MESSAGETYPES_H
#define GIAHINO_DEV_MESSAGETYPES_H

const char *PINS PROGMEM = "Sensors";
const char *VALUE PROGMEM = "Value";
const char *INPUT_TYPE PROGMEM = "Input";
const char *OUTPUT_TYPE PROGMEM = "Output";
const char *ACTION PROGMEM = "Action";
const char *ModelDHT PROGMEM = "dht";
const char *ModelSim800 PROGMEM = "sim800";
const char *ModelRelay PROGMEM = "relay";

//{
//"type": "Action",
//"value": [
//{
//"id": 3,
//"set": true
//}
//]
//}
////
//{
//"type": "Input",
//"value": {
//"chat_id": 1,
//"message": "AT "
//}
//}
//{
//"type": "Output",
//"value": {
//"chat_id": 1,
//"message": "AT "
//}
//}

/*
 *
 *
{
  "type": "Sensors",
  "value": [
    {
      "id": "sensor id",
      "model": "sensor model",
      "active": true,
      "sampleDuration": 3000,
      "pins": ["0", "1"]
    }
  ]
}

 * */

/*
{
  "type": "Value",
  "id": "sensor id",
  "data": [
    1,
    "String Data"
  ]
}

 * */

/*
{
  "type": "Action",
  "value": [
    {
      "id": "relay id",
      "set": true
    }
  ]
}
 {
  "type": "Input",
  "value": {
    "chat_id": 1,
    "id": "sensor-2",
    "message": "AT "
  }
}
 {
  "type": "Output",
  "value": {
    "chat_id": 1,
    "id": "sensor-1",
    "message": "AT "
  }
}

 * */

#endif //GIAHINO_DEV_MESSAGETYPES_H
