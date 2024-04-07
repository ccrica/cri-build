Chart.register( ChartDataLabels );

const ctxB = document.getElementById('chartRisk1');
let cVide = 'rgba(0, 0, 0, 0)';
//import { recupResult } from './data.js';
//const legendLabels = recupResult.map(item => item.label);
const legendLabelColors = ["rgba(255, 99, 132,1)", "rgba(255, 159, 64,1)", "rgba(255, 205, 86,1)", "rgba(75, 192, 192,1)", "rgba(54, 162, 235,1)", "rgba(153, 102, 255,1)"];;
const legendLabelColorsFond = ["rgba(255, 99, 132,0.3)", "rgba(255, 159, 64,0.3)", "rgba(255, 205, 86,0.3)", "rgba(75, 192, 192,0.3)", "rgba(54, 162, 235,0.3)", "rgba(153, 102, 255,0.3)"];
const legendLabels = ["Domaine 1", "Domaine 2", "Domaine 3", "Domaine 4", "Domaine 5", "Domaine 6"];
const config = {
    type: "polarArea",
    data: {
        labels: [legendLabels[0], legendLabels[1], legendLabels[2], legendLabels[3], legendLabels[4], legendLabels[5]],
        datasets: [
            {
//                data: [0, 80, 0, 40, 0, 54, 0, 62, 0, 71, 0, 45],
//                backgroundColor: [cVide, legendLabelColors[0], cVide, legendLabelColors[1],cVide,  legendLabelColors[2],cVide,  legendLabelColors[3],cVide, legendLabelColors[4],cVide, legendLabelColors[5]],
                data: [0, 80,0, 0, 40,0, 0, 54,0, 0, 62,0, 0, 71,0, 0, 45,0],
                backgroundColor: [cVide, legendLabelColors[0],cVide, cVide, legendLabelColors[1],cVide, cVide, legendLabelColors[2],cVide, cVide, legendLabelColors[3],cVide, cVide,legendLabelColors[4],cVide, cVide, legendLabelColors[5], cVide],
                borderWidth: 0,
                datalabels: {
                  // valeur effective du domaine, démontrée en pourcent
                   formatter: (value, context) => value + '%',
                   color: "#ffffff"
                },
            },
            {
                helper: true,
                data: [100, 100, 100, 100, 100, 100],
                backgroundColor: [cVide, cVide, cVide,cVide, cVide, cVide],
                borderWidth: 0,
                datalabels: {
                   display: false
                }
            },
            {
              //helper: true,
              data: [100, 50, 50, 80, 90, 70],
              backgroundColor: [ legendLabelColorsFond[0], legendLabelColorsFond[1], legendLabelColorsFond[2],legendLabelColorsFond[3], legendLabelColorsFond[4], legendLabelColorsFond[5]],
              borderWidth: 0,
              datalabels: {
                 display: false
              }
          }
        ]
    },
    options: {
        layout: {
          padding: 20
        },
        scales: {
            r: {
                angleLines: {
                    display: false
                },
                ticks: {
                    display: false
                },
                pointLabels: {
                  display: false
                }
            }
        },
        scale: {
            min: 0,
            max: 100
        },
        plugins: {
          legend:{ display: false},
            labels: {
              arc: true,
              fontColor: '#000',
              position: 'outside',
              fontSize: 14,
              render: (args) => args.dataset && args.dataset.helper ? args.label : '',
              fontColor: (args) => legendLabelColors[args.index] 
            }
        },
        animation: {
          onComplete: function() {
              drawLogo2();
              console.log('1. Fonction logo appelée depuis le chart ButAtteint');
          }
      }
    }
}

const PolarRisk = new Chart(ctxB, config);


function drawLogo2() {
  console.log('2. Fonction logo appelée sur ButAtteint');
  const img = new Image();
  img.onload = function() {
    const ctxC = ctxB.getContext('2d');
      // Get the position and size of the chart
      const chartX = PolarRisk.chartArea.left;
      const chartY = PolarRisk.chartArea.top;
      const chartWidth = PolarRisk.chartArea.right - PolarRisk.chartArea.left;
      const chartHeight = PolarRisk.chartArea.bottom - PolarRisk.chartArea.top;

      // Calculate the center of the chart
      const centerX = chartX + chartWidth / 2;
      const centerY = chartY + chartHeight / 2;

      // Calculate the radius as a smaller fraction of the width or height of the chart
      const radius = Math.min(chartWidth, chartHeight) / 10; 

      // Calculate the size of the image
      const imgWidth = radius * 2;
      const imgHeight = imgWidth * (img.naturalHeight / img.naturalWidth);

      // Draw the image on the canvas
      ctxC.drawImage(img, centerX - imgWidth / 2, centerY - imgHeight / 2, imgWidth, imgHeight);

      ctxC.restore();
  };
  img.onerror = function() {
      console.log('3 à 6. Error loading image');
  };
  img.src = 'https://note.dumspiro.ch/images/logo_circle_2.svg'; // Change this to the path of your SVG file
  console.log('3 à 6. Logo lu et chargé - Polar Risk', img);
}

// Call drawLogo when the chart is first created
drawLogo2();

// Also call drawLogo when the window is resized, to ensure the logo stays in the correct position
window.addEventListener('resize', drawLogo2);

console.log('7. Canvas context:', ctxB);
console.log('8. Polar Risk mis à jour');
setTimeout(drawLogo2,100);