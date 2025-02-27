const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

// Rutas
router.get('/simulador', sensorController.getSimuladorStatus);
router.post('/control-ventilador', sensorController.controlVentilador);
router.get('/get-modo', sensorController.getModo);
router.post('/cambiar-modo', sensorController.cambiarModo);
router.post('/set-umbral', sensorController.setUmbral);
router.get('/get-umbral', sensorController.getUmbral);
router.get('/data', sensorController.getData);

module.exports = router;