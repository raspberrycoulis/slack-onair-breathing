#include "neopixel/neopixel.h"          // Required library

#define PIXEL_PIN D2                    // Define the Pin the data line is connected to on the Photon
#define PIXEL_COUNT 32                  // The total number of individual NeoPixels
#define PIXEL_TYPE WS2812               // The type of NeoPixels in use
#define BRIGHTNESS 255                  // Set the brightness limit (value between 0-255)

Adafruit_NeoPixel strip = Adafruit_NeoPixel(PIXEL_COUNT, PIXEL_PIN, PIXEL_TYPE);

int ledToggle(String command);          // This is for the function in the cloud that is called by Slack

void setup() {
  Particle.function("led", ledToggle);  // This names the function to be retrieved when making an IFTTT recipe.   
  strip.begin();                        // Initialize the strip
  strip.show();                         // Initialize all pixels to 'off'
  strip.setBrightness(BRIGHTNESS);      // Set brightness limit (value between 0-255)
}

// The loop to provide the breathing effect - adjusts the brightness of the NeoPixels

void loop() {
    for (int i=10; i<255; i++) {
        strip.setBrightness(i);
        strip.show();
        delay(10);
    }
    for (int i=255; i>10; i--) {
        strip.setBrightness(i);
        strip.show();
        delay(10);
    }
}

int ledToggle(String command) {
    if(command == "on") {
        colorAll(strip.Color(255, 255, 255), 255);
        Particle.publish("colour", "white");
        return 1;
    }
    else if(command == "red") {
        colorAll(strip.Color(255, 0, 0), 255);
        Particle.publish("colour", "red");
        return 2;
    }
    else if(command == "green") {
        colorAll(strip.Color(127, 255, 0), 255);
        Particle.publish("colour", "green");
        return 3;
    }
    else if(command == "blue") {
        colorAll(strip.Color(0, 255, 255), 255);
        Particle.publish("colour", "blue");
        return 4;
    }
    else if(command == "yellow") {
        colorAll(strip.Color(255, 255, 0), 255);
        Particle.publish("colour", "yellow");
        return 5;
    }
    else if(command == "purple") {
        colorAll(strip.Color(255, 0, 255), 255);
        Particle.publish("colour", "purple");
        return 6;
    }
    else if(command == "off") {
        colorAll(strip.Color(0, 0, 0), 0);
        Particle.publish("colour", "off");
        return 0;
    }
    else {
        return -1;
    }
}

// This is from the NeoPixel example library. 
void colorAll(uint32_t c, uint8_t wait) {
  uint16_t i;

  for(i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i, c);
  }
  strip.show();
  delay(wait);
}
