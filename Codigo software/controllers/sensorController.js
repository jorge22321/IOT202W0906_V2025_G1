const mqttClient = require('../utils/mqttClient');
const influx = require('../models/sensorModel');

let modoAutomatico = true;
let umbrales = {};

const sensorController = {
  getSimuladorStatus: (req, res) => {
    const estadoSimulador = mqttClient.getEstadoSimulador();
    res.json({ status: estadoSimulador });
  },

  controlVentilador: (req, res) => {
    const { message } = req.body;
    if (message && !modoAutomatico) {
      mqttClient.publishFanControl(message, (err) => {
        if (err) {
          res.status(500).json({ error: 'Error al publicar mensaje MQTT' });
        } else {
          res.json({ success: true, message: 'Mensaje MQTT enviado' });
        }
      });
    } else {
      res.status(400).json({ error: 'Mensaje no proporcionado o modo automático activado' });
    }
  },

  getModo: (req, res) => {
    res.json({ modo: modoAutomatico ? 'automatico' : 'manual' });
  },

  cambiarModo: (req, res) => {
    const { modo } = req.body;
    if (modo === 'automatico' || modo === 'manual') {
      modoAutomatico = modo === 'automatico';
      mqttClient.publishModo(modo, (err) => {
        if (err) {
          res.status(500).json({ error: 'Error al publicar mensaje MQTT' });
        } else {
          res.json({ success: true, modo: modoAutomatico ? 'automatico' : 'manual' });
        }
      });
    } else {
      res.status(400).json({ error: 'Modo no válido' });
    }
  },

  setUmbral: (req, res) => {
    const { tempUmbral, co2Umbral } = req.body;
    if (tempUmbral !== undefined && co2Umbral !== undefined) {
      umbrales = { tempUmbral: parseFloat(tempUmbral), co2Umbral: parseFloat(co2Umbral) };
      mqttClient.publishUmbral(umbrales, (err) => {
        if (err) {
          res.status(500).json({ error: 'Error al publicar umbrales en MQTT' });
        } else {
          res.json({ success: true, ...umbrales });
        }
      });
    } else {
      res.status(400).json({ error: 'Umbrales no proporcionados' });
    }
  },

  getUmbral: (req, res) => {
    res.json(umbrales);
  },

  getData: async (req, res) => {
    try {
      const resultsPresHum = await influx.query(`
        SELECT presion, humedad, time 
        FROM sensores 
        ORDER BY time DESC 
        LIMIT 10
      `);

      const resultsTemp = await influx.query(`
        SELECT temperatura, time 
        FROM sensores 
        ORDER BY time DESC 
        LIMIT 1
      `);

      const resultsCO2 = await influx.query(`
        SELECT co2, time 
        FROM sensores 
        ORDER BY time DESC 
        LIMIT 10
      `);

      const responseData = {
        presionHumedad: resultsPresHum,
        temperatura: resultsTemp.length > 0 ? resultsTemp[0] : null,
        co2: resultsCO2
      };

      res.json(responseData);
    } catch (error) {
      console.error('❌ Error al obtener datos de InfluxDB:', error);
      res.status(500).json({ error: 'Error al obtener datos' });
    }
  }
};

module.exports = sensorController;