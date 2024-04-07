const chartDataObj = {
    labels: [['txt1','txt2', 'txt3', 'txt4', 'txt5', 'txt6'],['tat1b','tat2b', 'tat3b', 'tat4b', 'tat5b', 'tat6b'],['tbt1c','tbt2c', 'tbt3c', 'tbt4c', 'tbt5c', 'tbt6c']],
    personalData: [32, 57],
    orgData: [18, 42],
    title: [110,110,110,110,110,110]
};

const chartData = {
    labels: chartDataObj.labels,
    datasets: [{
        label: 'Title',
        data: chartDataObj.title,
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Light pink fill
        borderColor: 'rgb(255, 99, 132)', // Pink border
        pointBackgroundColor: 'rgb(255, 99, 132)', // Pink points
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
    },
    {
        label: 'Personal Data',
        data: chartDataObj.personalData,
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Light pink fill
        borderColor: 'rgb(255, 99, 132)', // Pink border
        pointBackgroundColor: 'rgb(255, 99, 132)', // Pink points
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
    },
    {
        label: 'Organisation Data',
        data: chartDataObj.orgData,
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Light blue fill
        borderColor: 'rgb(54, 162, 235)', // Blue border
        pointBackgroundColor: 'rgb(54, 162, 235)', // Blue points
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
    }]
};
const options = {
    elements: {
        line: {
            borderWidth: 5,
            tension: 0.8, // Adjust this value for more or less curvature
        },
        point: {
            radius: 10
        }
    },
    scales: {
        r: {
            angleLines: {
                display: false
            },
            suggestedMin: 40,
            suggestedMax: 100,
            ticks: {
                backdropColor: 'transparent',
                stepSize: 20
            },
            pointLabels: {
                font: {
                    size: 15 // Reduced for a more professional look
                },
                color: '#666'
            }
        }
    },
    plugins: {
        //datalabels: ChartDataLabels,
        labels: {
            render: 'label',
            arc: true,
            position: 'outside',
            fontColor: '#666',
            fontSize: 9,
            outsidePadding: 12,
            textMargin: 4,
            fontStyle: 'bold',
        },
        legend: {
            display: false, // Set to true for professional charts to identify datasets
            position: 'top' // A common position for legends in professional reporting
        },
        filler: {
            propagate: true
        },
        tooltip: {
            usePointStyle: true, // Use point style for better readability
            backgroundColor: 'rgba(0,0,0,0.8)' // Semi-transparent black for a sleek look
        }
    },
    maintainAspectRatio: true,
};

const config2 = {
    type: 'polarArea',
    data: chartData,
    options: options
};

const myRadarChart = new Chart(
    document.getElementById('chartRisk2'),
    config2
);