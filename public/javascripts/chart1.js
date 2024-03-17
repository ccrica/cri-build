        const ctx = document.getElementById('myChart').getContext('2d');
        const logoCtx = document.getElementById('myLogo').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'polarArea',
            data: {
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
                responsive: true,
                scales: {
                    r: {
                        beginAtZero: true
                    }
                }
            }
        });
        function drawLogo() {
            const img = new Image();
            img.onload = function() {
                // Calculate the center of the canvas
                const centerX = logoCtx.canvas.width / 2;
                const centerY = logoCtx.canvas.height / 2;
                // Calculate the radius as half the width or height of the image, whichever is smaller
                const radius = Math.min(img.width, img.height) / 2;
                // Create a circular clipping path
                logoCtx.beginPath();
                logoCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                logoCtx.clip();
                // Draw the image in the center of the canvas
                logoCtx.drawImage(img, centerX - img.width / 2, centerY - img.height / 2);
                // Reset the clipping path
                logoCtx.restore();
            };
            img.onerror = function() {
                console.log('Error loading image');
            };
            img.src = './images/logo.png';
                console.log('Image loaded');
        }

        console.log('Canvas context:', ctx);

        // Call the drawLogo function after the chart is drawn
        //myChart.update();
        console.log('Chart updated');
        setTimeout(drawLogo,100);