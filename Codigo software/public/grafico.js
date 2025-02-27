  document.addEventListener("DOMContentLoaded", function () {

    
    const ctxPres = document.getElementById('presChart').getContext('2d');
    const ctxHum = document.getElementById('humChart').getContext('2d');
    const ctxCO2 = document.getElementById('co2Chart').getContext('2d');
    const setUmbralButton = document.getElementById('setUmbral');
    const currentTempUmbralDisplay = document.getElementById('currentTempUmbral');
    const currentCO2UmbralDisplay = document.getElementById('currentCO2Umbral');  
    const maxDataPoints = 10;
    
    const tempColor = '#ff6384';
    const presColor = '#36a2eb';
    const humColor = '#4bc0c0';
    const co2Color = '#ff9f40';

    document.querySelector('#tempGauge').closest('.chart-card').querySelector('h2').style.color = tempColor;
    document.querySelector('#presChart').closest('.chart-card').querySelector('h2').style.color = presColor;
    document.querySelector('#humChart').closest('.chart-card').querySelector('h2').style.color = humColor;
    document.querySelector('#co2Chart').closest('.chart-card').querySelector('h2').style.color = co2Color;

    const commonChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0,
      },
      interaction: {
        mode: 'nearest',
        intersect: false,
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
          },
          ticks: {
            color: '#e0e0e0',
          },
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
          },
          ticks: {
            color: '#e0e0e0',
            reverse: true,
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#e0e0e0',
          },
        },
        tooltip: {
          enabled: true,
          backgroundColor: '#1e1e1e',
          titleColor: '#e0e0e0',
          bodyColor: '#e0e0e0',
          borderColor: '#00ffcc',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 5,
          displayColors: false,
          callbacks: {
            title: (context) => {
              return context[0].dataset.label;
            },
            label: (context) => {
              const label = context.dataset.label || '';
              const value = context.raw || 0;
              return `${label}: ${value}`;
            },
          },
        },
      },
    };

    const presChart = new Chart(ctxPres, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Presión (hPa)',
          data: [],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: presColor,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: true,
        }]
      },
      options: commonChartOptions,
    });

    const humChart = new Chart(ctxHum, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Humedad (%)',
          data: [],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: humColor,
          borderWidth: 2,
          pointRadius: 5,
          pointBackgroundColor: humColor,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: humColor,
        }]
      },
      options: commonChartOptions,
    });

    const co2Chart = new Chart(ctxCO2, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'CO2 (ppm)',
          data: [],
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: co2Color,
          borderWidth: 2,
          pointRadius: 5,
          pointBackgroundColor: co2Color,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: co2Color,
        }]
      },
      options: commonChartOptions,
    });

    const tempGauge = echarts.init(document.getElementById('tempGauge'));

    const gaugeOption = {
      series: [
        {
          type: 'gauge',
          center: ['50%', '70%'],
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: 40,
          splitNumber: 10,
          itemStyle: {
            color: '#ff6384'
          },
          progress: {
            show: true,
            width: 30
          },
          pointer: {
            show: false
          },
          axisLine: {
            lineStyle: {
              width: 30,
              lineStyle: {
                color: 'rgba(75, 192, 192, 0.2)'
              }
            }
          },
          axisTick: {
            distance: -45,
            splitNumber: 5,
            lineStyle: {
              width: 2,
              color: '#ff6384'
            }
          },
          splitLine: {
            distance: -52,
            length: 14,
            lineStyle: {
              width: 3,
              color: 'rgba(75, 192, 192, 0.2)'
            }
          },
          axisLabel: {
            distance: -7, // Ajusta esta distancia para acercar los números
          color: '#FFFFFF',
          fontSize: 12
          },
          anchor: {
            show: false
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            width: '60%',
            lineHeight: 40,
            borderRadius: 8,
            offsetCenter: [0, '-10%'],
            fontSize: 22,
            fontWeight: 'bolder',
            formatter: '{value}°C',
            color: 'inherit'
          },
          data: [
            {
              
            }
          ]
        },
        {
          type: 'gauge',
          center: ['50%', '70%'],
          startAngle: 200,
          endAngle: -20,
          min: 1,
          max: 60,
          itemStyle: {
            color: '#ff6384'
          },
          progress: {
            show: true,
          },
          pointer: {
            show: false
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false
          },
          detail: {
            show: false
          },
          data: [
            {
              
            }
          ]
        }
      ]
    };
    tempGauge.setOption(gaugeOption);


    // Función para verificar el estado del simulador
  function verificarEstadoSimulador() {
    fetch('/simulador')
      .then(response => response.json())
      .then(data => {
        if (data.status === true) {
          // Activar la animación de giro
          fanIcon.style.animation = 'spin 0.3s linear infinite';
        } else if (data.status === false) {
          // Detener la animación de giro
          fanIcon.style.animation = 'none';
        }
      })
      .catch(error => console.error('Error al obtener el estado del simulador:', error));
  }
 // Verificar el estado del simulador cada 2 segundos
 setInterval(verificarEstadoSimulador, 2000);

    function actualizarUmbralesEnDOM() {
      currentTempUmbralDisplay.textContent = `${currentTempUmbral}°C`;
      currentCO2UmbralDisplay.textContent = `${currentCO2Umbral}ppm`;
    }

    setUmbralButton.addEventListener('click', () => {
      const tempUmbral = document.getElementById('tempUmbral').value;
      const co2Umbral = document.getElementById('co2Umbral').value;
    
      if (tempUmbral && co2Umbral) {
        // Actualizar las variables de umbrales
        currentTempUmbral = parseFloat(tempUmbral);
        currentCO2Umbral = parseFloat(co2Umbral);
    
        // Actualizar los umbrales en el DOM
        actualizarUmbralesEnDOM();
    
        // Enviar los umbrales al servidor (opcional, si necesitas guardarlos en el backend)
        fetch('/set-umbral', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tempUmbral: currentTempUmbral, co2Umbral: currentCO2Umbral }),
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              console.log('Umbrales establecidos:', data);
            } else {
              console.error('Error al establecer umbrales:', data.error);
            }
          })
          .catch(error => console.error('Error al enviar umbrales:', error));
      } else {
        console.error('Por favor, ingrese valores válidos para los umbrales.');
      }
    });
    actualizarUmbralesEnDOM();
    // Obtener los umbrales actuales al cargar la página
    fetch('/get-umbral')
      .then(response => response.json())
      .then(data => {
        if (data.tempUmbral && data.co2Umbral) {
          currentTempUmbral = data.tempUmbral;
          currentCO2Umbral = data.co2Umbral;
          currentTempUmbralDisplay.textContent = `${data.tempUmbral}°C`;
          currentCO2UmbralDisplay.textContent = `${data.co2Umbral}ppm`;
        }
      })
      .catch(error => console.error('Error al obtener umbrales:', error));


    let lastTemperature = null;
    let modoAutomatico = true; // Por defecto, el control es automático


  // Variables para rastrear el estado de las alertas
  let alertaTemperaturaActiva = false;
  let alertaCO2Activa = false;

  // Referencias a los elementos de alerta
  const alertaTemperaturaElement = document.createElement('div');
  const alertaCO2Element = document.createElement('div');
  const alertasContainer = document.getElementById('alertas');

  // Agregar elementos de alerta al contenedor
  alertasContainer.appendChild(alertaTemperaturaElement);
  alertasContainer.appendChild(alertaCO2Element);

  // Función para mostrar o actualizar una alerta
  function mostrarAlerta(elemento, mensaje, tipo) {
    elemento.className = `alerta ${tipo}`;
    elemento.textContent = mensaje;
  }

  function verificarUmbrales(temperatura, co2) {
    // Verificar temperatura
    if (temperatura > currentTempUmbral) {
      if (!alertaTemperaturaActiva) {
        mostrarAlerta(alertaTemperaturaElement, `🚨 Temperatura alta detectada: ${temperatura}°C `, 'alerta-temperatura');
        alertaTemperaturaActiva = true;
      } else {
        // Actualizar el mensaje con el valor actual de la temperatura
        mostrarAlerta(alertaTemperaturaElement, `🚨 Temperatura alta detectada: ${temperatura}°C`, 'alerta-temperatura');
      }
    } else if (temperatura <= currentTempUmbral && alertaTemperaturaActiva) {
      mostrarAlerta(alertaTemperaturaElement, `✅ Temperatura normal: ${temperatura}°C`, 'alerta-temperatura-solucionado');
      alertaTemperaturaActiva = false;
      // Eliminar la alerta después de 5 segundos
      setTimeout(() => {
        alertaTemperaturaElement.textContent = '';
        alertaTemperaturaElement.className = '';
      }, 5000);
    }
    // Verificar CO2
    if (co2 > currentCO2Umbral) {
      if (!alertaCO2Activa) {
        mostrarAlerta(alertaCO2Element, `🚨 CO2 alto detectado: ${co2}ppm `, 'alerta-co2');
        alertaCO2Activa = true;
      } else {
        // Actualizar el mensaje con el valor actual del CO2
        mostrarAlerta(alertaCO2Element, `🚨 CO2 alto detectado: ${co2}ppm`, 'alerta-co2');
      }
    } else if (co2 <= currentCO2Umbral && alertaCO2Activa) {
      mostrarAlerta(alertaCO2Element, `✅ CO2 normal: ${co2}ppm`, 'alerta-co2-solucionado');
      alertaCO2Activa = false;
      // Eliminar la alerta después de 5 segundos
      setTimeout(() => {
        alertaCO2Element.textContent = '';
        alertaCO2Element.className = '';
      }, 5000);
    }
  }
  function updateCharts() {
    fetch('/data')
      .then(response => response.json())
      .then(data => {
        if (!data || !data.presionHumedad || !data.temperatura || !data.co2) {
          console.error('Datos no válidos:', data);
          return;
        }

        

        // Obtener los umbrales actuales del servidor
        fetch('/get-umbral')
      .then(response => response.json())
      .then(data => {
        if (Object.keys(data).length === 0) {
          // Si no hay umbrales guardados, establecer valores por defecto en el cliente
          currentTempUmbralDisplay.textContent = `26°C`; // Valor por defecto
          currentCO2UmbralDisplay.textContent = `1000ppm`; // Valor por defecto
        } else {
          // Si hay umbrales guardados, actualizar el DOM
          currentTempUmbralDisplay.textContent = `${data.tempUmbral}°C`;
          currentCO2UmbralDisplay.textContent = `${data.co2Umbral}ppm`;
        }
      })
      .catch(error => console.error('Error al obtener umbrales:', error));

        function updateChart(chart, newData, time) {
          chart.data.labels.unshift(time);
          chart.data.datasets[0].data.unshift(newData);

          if (chart.data.labels.length > maxDataPoints) {
            chart.data.labels.pop();
            chart.data.datasets[0].data.pop();
          }

          chart.update('none');
        }

        // Actualizar gráficos como antes
        data.presionHumedad.forEach(point => {
          const time = new Date(point.time).toLocaleTimeString();
          updateChart(presChart, point.presion, time);
          updateChart(humChart, point.humedad, time);
        });


        data.co2.forEach(point => {
          const time = new Date(point.time).toLocaleTimeString();
          updateChart(co2Chart, point.co2, time);
        });


        const temperatura = parseFloat(data.temperatura.temperatura);
        const co2 = data.co2.length > 0 ? data.co2[0].co2 : null;

        // Verificar umbrales y mostrar alertas
        verificarUmbrales(temperatura, co2);

        if (!isNaN(temperatura)) {
          tempGauge.setOption({
            series: [
              {
                data: [
                  {
                    value: temperatura
                  }
                ]
              }
            ]
          });
        } else {
          console.error('Temperatura no válida:', data.temperatura.temperatura);
        }

      
    })
    .catch(error => console.error('Error al obtener datos:', error));
  }

  const toggle = document.getElementById('modo-toggle');


    

  fetch('/get-modo')
  .then(response => response.json())
  .then(data => {
    if (data.modo !== undefined) {
      modoAutomatico = data.modo === 'automatico'; // Sincronizar el estado en el frontend
      toggle.checked = modoAutomatico; // Sincronizar el toggle
      console.log(`Modo inicial: ${modoAutomatico ? 'Automático' : 'Manual'}`);
    }
  })
  .catch(error => console.error('Error al obtener el modo:', error));


  toggle.addEventListener('change', () => {
    const nuevoModo = toggle.checked ? 'automatico' : 'manual';
    fetch('/cambiar-modo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ modo: nuevoModo }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          modoAutomatico = data.modo === 'automatico'; // Actualiza el estado en el frontend
          console.log(`Modo cambiado a: ${modoAutomatico ? 'Automático' : 'Manual'}`);
        } else {
          console.error('Error al cambiar el modo:', data.error);
        }
      })
      .catch(error => console.error('Error al cambiar el modo:', error));
  });
  


    setInterval(updateCharts, 2000);

    const fanIcon = document.querySelector('.icono i');
    
    function enviarMensajeMQTT(encender) {
      if (!modoAutomatico) { // Solo envía mensajes MQTT en modo manual
        const mensaje = encender ? '{"ventilador":true}' : '{"ventilador":false}';
        fetch('/control-ventilador', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: mensaje }),
        })
          .then(response => response.json())
          .then(data => {
            console.log('Mensaje MQTT enviado:', data);
          })
          .catch(error => {
            console.error('Error al enviar mensaje MQTT:', error);
          });
      } else {
        console.log('Modo automático activado. Los botones no tienen control.');
      }
    }
    
    const encendidoButton = document.querySelector('.control-button.encendido');
    const apagadoButton = document.querySelector('.control-button.apagado');
    
    encendidoButton.addEventListener('click', () => {
      if (!modoAutomatico) { // Solo funciona en modo manual
        enviarMensajeMQTT(true); // Enviar mensaje MQTT para encender el ventilador
      } else {
        console.log('Modo automático activado. Los botones no tienen control.');
      }
    });
    
    apagadoButton.addEventListener('click', () => {
      if (!modoAutomatico) { // Solo funciona en modo manual
        enviarMensajeMQTT(false); // Enviar mensaje MQTT para apagar el ventilador
      } else {
        console.log('Modo automático activado. Los botones no tienen control.');
      }
    }); 
  

     // Definir la animación de giro
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = `
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `;
  document.head.appendChild(styleSheet);
  });