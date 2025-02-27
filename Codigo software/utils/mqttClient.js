const mqtt = require('mqtt');
const influx = require('../models/sensorModel');

const brokerUrl = 'mqtt://broker.emqx.io';
const bme280Topic = 'iot/bme280';
const fanControlTopic = 'iot/fan/control';
const simuladorTopic = 'iot/status';
const modoTopic = 'iot/modo';
const umbralTopic = 'iot/umbral';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const options = { clientId, clean: true, connectTimeout: 4000 };
const client = mqtt.connect(brokerUrl, options);

let estadoSimulador = false;

client.on('connect', () => {
  console.log('✅ Conectado al broker MQTT');

  // Publicar el mensaje inicial de modo automático
  const mensajeInicial = JSON.stringify({ modo: 'automatico' });
  client.publish(modoTopic, mensajeInicial, { qos: 0, retain: false }, (err) => {
    if (err) {
      console.error('❌ Error al publicar mensaje inicial MQTT:', err);
    } else {
      console.log(`✅ Mensaje inicial MQTT enviado al tópico ${modoTopic}:`, mensajeInicial);
    }
  });

  // Suscribirse a los temas
  client.subscribe([bme280Topic, simuladorTopic], (err) => {
    if (!err) {
      console.log(`📡 Suscrito a los temas: ${bme280Topic} y ${simuladorTopic}`);
    } else {
      console.error('❌ Error al suscribirse', err);
    }
  });
});

client.on('message', (topic, message) => {
  try {
    const cleanedMessage = message.toString().replace(/nan/g, 'null');
    const data = JSON.parse(cleanedMessage);
    console.log('Datos recibidos:', data);

    if (topic === bme280Topic) {
      const { temp, pres, hum, co2 } = data;

      // Guardar temperatura, presión y humedad en sensor1
      if (temp !== undefined && pres !== undefined && hum !== undefined) {
        console.log(`📥 Recibido - Temp: ${temp}°C, Pres: ${pres}hPa, Hum: ${hum}%`);
        influx.writePoints([
          {
            measurement: 'sensores',
            tags: { ubicacion: 'sensor1' },
            fields: { temperatura: temp, presion: pres, humedad: hum }
          }
        ]).then(() => {
          console.log('✅ Datos de sensor1 guardados en InfluxDB');
        }).catch(err => {
          console.error('❌ Error guardando datos de sensor1 en InfluxDB:', err);
        });
      }

      // Guardar CO2 en sensor2
      if (co2 !== undefined) {
        const co2Value = co2 !== null ? co2 : -1; // Asigna -1 si co2 es null
        console.log(`📥 Recibido - CO2: ${co2Value}ppm`);
        influx.writePoints([
          {
            measurement: 'sensores',
            tags: { ubicacion: 'sensor2' },
            fields: { co2: co2Value }
          }
        ]).then(() => {
          console.log('✅ Datos de sensor2 (CO2) guardados en InfluxDB');
        }).catch(err => {
          console.error('❌ Error guardando datos de sensor2 (CO2) en InfluxDB:', err);
        });
      }
    } else if (topic === simuladorTopic) {
      // Actualizar el estado del simulador
      if (data.status === true || data.status === false) {
        estadoSimulador = data.status;
        console.log(`📥 Estado del simulador actualizado: ${estadoSimulador}`);
      }
    }
  } catch (error) {
    console.error('❌ Error al procesar el mensaje MQTT:', error);
  }
});

const mqttClient = {
  publishFanControl: (message, callback) => {
    client.publish(fanControlTopic, message, { qos: 0, retain: false }, callback);
  },

  publishModo: (modo, callback) => {
    const mensaje = JSON.stringify({ modo });
    client.publish(modoTopic, mensaje, { qos: 0, retain: false }, callback);
  },

  publishUmbral: (umbrales, callback) => {
    const mensaje = JSON.stringify(umbrales);
    client.publish(umbralTopic, mensaje, { qos: 0, retain: false }, callback);
  },

  getEstadoSimulador: () => {
    return estadoSimulador;
  }
};

module.exports = mqttClient;