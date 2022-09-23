//
// Created by shirejoni on 6/3/22.
//

#ifndef GIAHINO_DEV_LOG_H
#define GIAHINO_DEV_LOG_H

String l;
void logSection(const char c[]) {
    l = c;
    Serial.println("\n==========================\n= " + l + "\n==========================");
}

void logLine(const char c[]) {
    l = c;
    Serial.println("\n= " + l + " =================");
}

#endif //GIAHINO_DEV_LOG_H
