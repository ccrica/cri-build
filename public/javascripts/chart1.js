        const ctx = document.getElementById('myChart').getContext('2d');
//        let img;
        const myChart = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 6'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
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
                    borderWidth: 1
                },
                {
                    label: 'Zone pleine',
                    data: [0,15,0,0, 30,0,0, 12,0,0, 13,0,0, 11,0,0, 12,0],
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
                    borderWidth: 1,
                    hidden: false
        }]
            },
            options: {

                plugins: {
                    afterDraw: (chart) => {
                        var ctx = chart.ctx;
                        chart.data.labels.forEach((label, index) => {
                            var dataset = chart.data.datasets[0];
                            var meta = chart.getDatasetMeta(0);
                            var total = dataset.data.reduce((total, currentValue) => total + currentValue);
                            var currentValue = dataset.data[index];
                            var percentage = Math.floor(((currentValue/total) * 100)+0.5);
            
                            var model = meta.data[index]._model;
                            var mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2;
                            var start_angle = model.startAngle;
                            var end_angle = model.endAngle;
                            var mid_angle = start_angle + (end_angle - start_angle)/2;
            
                            var x = mid_radius * Math.cos(mid_angle);
                            var y = mid_radius * Math.sin(mid_angle);
            
                            ctx.fillStyle = '#000';
                            ctx.font = "1em Arial";
                            ctx.fillText(label, model.x + x, model.y + y);
                        });
                    }
                },
                responsive: true,
                scales: {
                    r: {
                        beginAtZero: true
                    }
                },
                animation: {
                    onComplete: function() {
                        drawLogo();
                        console.log('1. Fonction logo appelée depuis le chart')
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
            console.log('2. Fonction logo appelée')
            const img = new Image();
            img.onload = function() {
                // Get the position and size of the chart
                const chartX = myChart.chartArea.left;
                const chartY = myChart.chartArea.top;
                const chartWidth = myChart.chartArea.right - myChart.chartArea.left;
                const chartHeight = myChart.chartArea.bottom - myChart.chartArea.top;
                console.log('3. Chart position and size:', chartX, chartY, chartWidth, chartHeight); // Add this line
                // Calculate the center of the chart
                const centerX = chartX + chartWidth / 2;
                const centerY = chartY + chartHeight / 2;
                console.log('4. Chart center:', centerX, centerY); // Add this line
                // Calculate the radius as a smaller fraction of the width or height of the chart
                const radius = Math.min(chartWidth, chartHeight) / 20; // Change this to adjust the size of the logo
                console.log('5. Radius:', radius); // Add this line
                // Calculate the size of the image
                const imgWidth = radius * 2;
                const imgHeight = imgWidth * (img.naturalHeight / img.naturalWidth);
                console.log('6. Image size:', imgWidth, imgHeight); // Add this line
                // Draw the image on the canvas
                ctx.drawImage(img, centerX - imgWidth / 2, centerY - imgHeight / 2, imgWidth, imgHeight);
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