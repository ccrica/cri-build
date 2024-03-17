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