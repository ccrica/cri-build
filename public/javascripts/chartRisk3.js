const chartDataObjRisk = {
    labels: ['', 'Financier', '', '', 'Réputationnel', '', '', 'Légal', '', '', 'Mission/stratégique', '', '', 'Opérationnel', '', '', 'Physique/Santé', ''],
    rObjectifs: [12, 19, 3, 5, 2, 3], //6 valeurs
    rAtteints: [0,15,0,0, 30,0,0, 12,0,0, 13,0,0, 11,0,0, 12,0],
    rTitres: [30] //devrait être le maximum + 5 pour des titres positionnés en dehors du chart
};
const ctx = document.getElementById('chartRisk3').getContext('2d');

//        document.getElementById('chartRisk3').style.height = '500px';
        const myChart = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: ['Financier  Réputationnel  Légal  Mission/stratégique  Opérationnel  Physique/Santé', '', '', '', '', '' ],
                datasets: [{
                    //label: '# of Votes',
                    data: chartDataObjRisk.rObjectifs,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    datalabels:{
                        display: false
                    },
                    hidden:false
                    //,borderWidth: 1
                },
                {   //label: 'Zone pleine',
                    data: chartDataObjRisk.rAtteints,
                    backgroundColor: [
                        'rgba(0, 0, 0, 0)',    
                        'rgba(255, 99, 132, 1)',
                        'rgba(0, 0, 0, 0)',    
                        'rgba(0, 0, 0, 0)',    
                        'rgba(54, 162, 235, 1)',
                        'rgba(0, 0, 0, 0)',    
                        'rgba(0, 0, 0, 0)',    
                        'rgba(255, 206, 86, 1)',
                        'rgba(0, 0, 0, 0)',    
                        'rgba(0, 0, 0, 0)',    
                        'rgba(75, 192, 192, 1)',
                        'rgba(0, 0, 0, 0)',    
                        'rgba(0, 0, 0, 0)',    
                        'rgba(153, 102, 255, 1)',
                        'rgba(0, 0, 0, 0)',    
                        'rgba(0, 0, 0, 0)',    
                        'rgba(255, 159, 64, 1)',
                        'rgba(0, 0, 0, 0)'
                    ],
                    datalabels: {
                        display: false
                    },
                    //borderWidth: 1,
                    hidden: false
        },{
                        data: chartDataObjRisk.rTitres,
            backgroundColor: [
                'rgba(0, 0, 0,0)'
                ],
                datalabels: {
                    display: true,
                    color: 'green'
                },
            }]
            },
            plugins: [ChartDataLabels],
            options: {
                datalabels: {
                    display: true,
                    align: 'end',
                    anchor: 'end',
                    color: '#666',
                    formatter: function(_, context) {
                        return context.chart.data.labels[context.dataIndex];
                    }
                },
                responsive: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        display: false

                    }
                },
                animation: {
                    onComplete: function() {
                        drawLogo();
                        console.log('1. Fonction logo appelée depuis le graphique version 1')
                    }
                }
            }
        });

window.addEventListener('resize', function() {
            const logo = document.getElementById('myLogo');
            const aspectRatio = logo.naturalWidth / logo.naturalHeight;
            logo.style.height = (logo.offsetWidth / aspectRatio) + 'px';
            drawLogo();
        });

        function drawLogo() {
            console.log('2. Fonction logo appelée');
            const img = new Image();
            img.onload = function() {
                // Get the position and size of the chart
                const chartX = myChart.chartArea.left;
                const chartY = myChart.chartArea.top;
                const chartWidth = myChart.chartArea.right - myChart.chartArea.left;
                const chartHeight = myChart.chartArea.bottom - myChart.chartArea.top;

                // Calculate the center of the chart
                const centerX = chartX + chartWidth / 2;
                const centerY = chartY + chartHeight / 2;

                // Calculate the radius as a smaller fraction of the width or height of the chart
                const radius = Math.min(chartWidth, chartHeight) / 20; 

                // Calculate the size of the image
                const imgWidth = radius * 2;
                const imgHeight = imgWidth * (img.naturalHeight / img.naturalWidth);

                // Draw the image on the canvas
                ctx.drawImage(img, centerX - imgWidth / 2, centerY - imgHeight / 2, imgWidth, imgHeight);

                ctx.restore();
            };
            img.onerror = function() {
                console.log('3 à 6. Error loading image');
            };
            img.src = 'https://note.dumspiro.ch/images/logo_circle.svg'; // Change this to the path of your SVG file
            console.log('3 à 6. Logo lu et chargé', img);
        }

// Call drawLogo when the chart is first created
drawLogo();

// Also call drawLogo when the window is resized, to ensure the logo stays in the correct position
window.addEventListener('resize', drawLogo);

        console.log('7. Canvas context:', ctx);
        console.log('8. Chart updated');
        setTimeout(drawLogo,100);