const Influx = require('influx');

const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'iot',
  schema: [
    {
      measurement: 'sensores',
      fields: {
        temperatura: Influx.FieldType.FLOAT,
        presion: Influx.FieldType.FLOAT,
        humedad: Influx.FieldType.FLOAT,
        co2: Influx.FieldType.FLOAT
      },
      tags: ['ubicacion']
    }
  ]
});

influx.getDatabaseNames()
  .then(names => {
    if (!names.includes('iot')) {
      return influx.createDatabase('iot');
    }
  })
  .then(() => {
    console.log('✅ InfluxDB listo para recibir datos');
  })
  .catch(err => {
    console.error('❌ Error conectando con InfluxDB', err);
  });

module.exports = influx;