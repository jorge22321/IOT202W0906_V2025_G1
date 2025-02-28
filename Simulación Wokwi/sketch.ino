#include <Wire.h> // biblioteca para comunicación I2C
#include <SPI.h> // biblioteca para comunicación SPI (Serial Peripheral Interface).
#include <Adafruit_NeoPixel.h> // biblioteca para controlar tiras de LED tipo NeoPixel
#include <LiquidCrystal_I2C.h> // biblioteca para manejar pantallas LCD con interfaz I2C
#include "DHTesp.h" // biblioteca para manejar sensores de temperatura y humedad DHT11, DHT22 y similares.

// 📌 pin para el mq135
#define PPM_PIN 4 

// 📌 define LED_PIN    25   // ESP32
#define LED_PIN   17    // D1 mini

// How many NeoPixels are attached to the Arduino?
#define LED_COUNT 16

// 📌 Definir el pin de DHT22
const int DHT_PIN = 13;

// 📌 Variables globales
DHTesp dhtSensor;

// 📌 Configuración de la pantalla LCD (dirección 0x27 o 0x3F)
LiquidCrystal_I2C lcd(0x27, 16, 2);

// 📌 Declare our NeoPixel strip object:
Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

unsigned long delayTime = 2000; // Tiempo entre mediciones (2s)

// 📌 Función para leer y mostrar los datos del BME280 en LCD
void mostrarDatos(float t, float h, int co2) {    
    // Muestra en el Monitor Serie
    Serial.println("Temp: " + String(t, 2) + "°C");
    Serial.println("Humedad: " + String(h, 2) + "%");
    Serial.print("PPM: ");
    Serial.println(co2);
    Serial.println("-------------------");

    // Muestra en la LCD
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Temp: ");
    lcd.print(t);
    lcd.print(" C");
    lcd.setCursor(0, 1);
    lcd.print("H:");
    lcd.print(String(h, 1));
    lcd.print("% ");
    lcd.print("PPM:");
    lcd.print(co2);
}

// 📌 Función para los colores del NeoPixel
void rainbowFade2White(int wait, int rainbowLoops, int whiteLoops) {
  int fadeVal=0, fadeMax=100;

  for(uint32_t firstPixelHue = 0; firstPixelHue < rainbowLoops*65536;
    firstPixelHue += 256) {

    for(int i=0; i<strip.numPixels(); i++) { // For each pixel in strip...
      uint32_t pixelHue = firstPixelHue + (i * 65536L / strip.numPixels());
      strip.setPixelColor(i, strip.gamma32(strip.ColorHSV(pixelHue, 255,
        255 * fadeVal / fadeMax)));
    }

    strip.show();
    delay(wait);

    if(firstPixelHue < 65536) {                              // First loop,
      if(fadeVal < fadeMax) fadeVal++;                       // fade in
    } else if(firstPixelHue >= ((rainbowLoops-1) * 65536)) { // Last loop,
      if(fadeVal > 0) fadeVal--;                             // fade out
    } else {
      fadeVal = fadeMax; // Interim loop, make sure fade is at max
    }
  }
}

// 📌 Función para el color del apagado del NeoPixel
void colorWipe(uint32_t color, int wait) {
  for (int i = 0; i < strip.numPixels(); i++) { // For each pixel in strip...
    strip.setPixelColor(i, color);         //  Set pixel's color (in RAM)
    strip.show();                          //  Update strip to match
    delay(wait);                           //  Pause for a moment
  }
}

void setup() {
    Serial.begin(115200);
    while (!Serial);  // Espera a que el puerto serie esté listo
    Serial.println(F("ESP32 + LCD + MQTT"));

    Wire.begin(21, 22);  // Inicializa I2C en ESP32 (SDA=21, SCL=22)

    // Inicializa la pantalla LCD
    lcd.init();
    lcd.backlight();
    lcd.setCursor(0, 0);
    lcd.print("Iniciando...");

    // Inicializa el NeoPixel
    strip.begin();           // INITIALIZE NeoPixel strip object (REQUIRED)
    strip.show();            // Turn OFF all pixels ASAP
    strip.setBrightness(250); // Set BRIGHTNESS to about 1/5 (max = 255)

    // Inicializa el BME280
    dhtSensor.setup(DHT_PIN, DHTesp::DHT22);
  
    delay(1000);  // Pausa para mostrar el mensaje inicial
    lcd.clear();
}

void loop() { 
    // Calculamos los valores de la temperatura y humedad
    TempAndHumidity  data = dhtSensor.getTempAndHumidity();
    float t = data.temperature; // temperatura
    float h = data.humidity; // humedad

    // Valor después del convertidor AD
    int16_t ppmValor = analogRead(PPM_PIN);
    // Asigne el valor correcto al convertidor AD
    int mappedppmValue = (ppmValor/4.095);
    
    mostrarDatos(t, h, mappedppmValue); // Muestra en LCD y Serial

    if(t >= 20){
      rainbowFade2White(0, 3, 1);
    }
    else
      colorWipe(strip.Color(255, 0, 0), 00); // RED

    delay(delayTime);
}