//json data simple (data.js original)
window.onload = function() {
    //handleFormSubmit();
    fetchSessionKeyDetails();
    setTokenexValue();
}

document.getElementById('submitForm').addEventListener('submit', function(event) {
// Prevent the form from being submitted normally
event.preventDefault();

// Get the form data
const token = document.getElementById('name').value;

// Log the form data
console.log(`Form submitted with name: ${token}`);

// Fetch data from the server
fetch('/submit', {
method: 'POST',
headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
},
body: `name=${encodeURIComponent(token)}`,
})
.then(() => {
return fetch(`/response_data?name=${encodeURIComponent(token)}`);
})
.then(response => {
console.log('Raw response from server:', response);
return response.json();
})
.then(data => {
console.log('Data from server:', data);
const firstElement = data[0];

// Create a structured view of the data
const dataContainer = document.getElementById('dbData');
dataContainer.innerHTML = `
    <p>Submit Date: ${firstElement.submitdate}</p>
    <p>Email: ${firstElement.email}</p>
    <p>Langue: ${firstElement.startlanguage}</p>
`;
document.getElementById('responseReceived').textContent = "Response";
document.documentElement.lang = firstElement.startlanguage;
console.log(document.documentElement.lang);


// Fetch the session key and call recupResult with the token and language
return fetch('/env')
    .then(response => response.json())
    .then(data => {
        const { LS_API_USER, LS_API_PWD } = data;
        return lsapi(LS_API_USER, LS_API_PWD);
    })
    .then(sessionKey => {
        console.log('Session key:', sessionKey);
        return recupResult(sessionKey, token, firstElement.startlanguage);
    })
    .catch(error => {
        console.error('Problem with request:', error.message);
    });
});
});

function fetchSessionKeyDetails(isSubmitClicked = false) {
    fetch('/sessionKeyDetails')
        .then(response => {
            if (!response.ok) {
                throw new Error(`ça fonctionne pas : ${response.status}`);
            }
            return response.json();
        })
        .then(sessionKeyDetails => {
            if (!isSubmitClicked) {
                document.getElementById('responseReceived').textContent = sessionKeyDetails.id;
            }
        })
        .catch(error => {
            console.log('Fetch error: ', error);
        });
}

function lsapi(LS_API_USER, LS_API_PWD) {
const url = 'https://ls.dumspiro.ch/index.php?r=admin/remotecontrol';
const options = {
method: 'POST',
headers: {
    'Content-Type': 'application/json',
    'Content-Length': '88'
},
body: JSON.stringify({method: 'get_session_key', params: [LS_API_USER, LS_API_PWD], id: 1})
};

return fetch(url, options)
.then(response => response.json()) // Parse the response as JSON
.then(data => {
    console.log('Response from ls.dumspiro.ch:', data);
    return data.result; // Return the session key
})
.catch(error => {
    console.error('Problem with request:', error.message);
    throw error;
});
}

function recupResult(sessionKey, token, language) {
    const url = 'https://ls.dumspiro.ch/index.php?r=admin/remotecontrol';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': '88'
        },
        body: JSON.stringify({
            method: 'export_responses_by_token',
            params: [sessionKey, "983971", "json", token, language, "all", "code", "long"], 
            id: 1
        })
    };
    return fetch(url, options)
    .then(response => response.json())
    .then(data => {
        // Show the container
        let container = document.querySelector('.container');
        container.classList.remove('container-hidden');
        container.classList.add('container-visible');

        console.log('Response from second request:', data);
        if (data.result) {
            // Decode the Base64-encoded JSON data
            const binaryString = atob(data.result);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const jsonData = new TextDecoder("utf-8").decode(bytes);
            console.log('Decoded JSON data:', jsonData);

            // Create a Blob with the JSON data
            const jsonBlob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' });

            // Create a link for the Blob
            const jsonURL = window.URL.createObjectURL(jsonBlob);
            const tempLink = document.createElement('a');
            tempLink.href = jsonURL;
            tempLink.setAttribute('download', `${token}.json`);
            tempLink.textContent = `Download ${token}.json`;

            // Append the link to the specific location in the HTML page
            const downloadLinkContainer = document.getElementById('downloadLinkContainer');
            if (downloadLinkContainer) {
                downloadLinkContainer.appendChild(tempLink);
            } else {
                console.error('Could not find element with id "downloadLinkContainer"');
            }

        //test positionnement création du chart
          // Extract the data and labels from the JSON data
          const chartData = [0, 80,0, 0, 40,0, 0, 54,0, 0, 62,0, 0, 71,0, 0, 45,0];
          const jsonDataObject = JSON.parse(jsonData);
          const responses = jsonDataObject.responses;
          const chartLabels = responses.map(response => {
            const values = [];
            for (let i = 1; i <= 6; i++) {
                const value = response[`E01PR[${i}]`];
                values.push(value);
            }
            return values;
            console.log('Chart labels:', chartLabels);
        });

          // Use the data to create the chart
          createChart(chartData, chartLabels, drawLogo2);
            //fin de test


            return JSON.parse(jsonData);
        }
    })
    .catch(error => {
        console.error('Problem with second request:', error.message);
        throw error;
    });
}

function setTokenexValue() {
fetch('/tokenex')
.then(response => response.json())
.then(data => {
    const inputField = document.getElementById('name');
    if (inputField) {
        inputField.value = data.TOKENEX;
    } else {
        console.error('Could not find element with id "name"');
    }
})
.catch(error => {
    console.error('Problem with request:', error.message);
});
}

function drawLogo2() {
    console.log('2. Fonction logo appelée sur ButAtteint');
    const img = new Image();
    img.onload = function() {
      const ctxB = ctxB.getContext('2d');
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
        ctxB.drawImage(img, centerX - imgWidth / 2, centerY - imgHeight / 2, imgWidth, imgHeight);
        ctxB.restore();
    };
    img.onerror = function() {
        console.log('3 à 6. Error loading image');
    };
    img.src = 'https://note.dumspiro.ch/images/logo_circle_2.svg'; // Change this to the path of your SVG file
    console.log('3 à 6. Logo lu et chargé - Polar Risk', img);
  }

function createChart(data, labels, onComplete) {
Chart.register( ChartDataLabels );

const ctxB = document.getElementById('chartRisk1');
let cVide = 'rgba(0, 0, 0, 0)';
//import { recupResult } from './data.js';
//const legendLabels = recupResult.map(item => item.label);
const legendLabelColors = ["rgba(255, 99, 132,1)", "rgba(255, 159, 64,1)", "rgba(255, 205, 86,1)", "rgba(75, 192, 192,1)", "rgba(54, 162, 235,1)", "rgba(153, 102, 255,1)"];;
const legendLabelColorsFond = ["rgba(255, 99, 132,0.3)", "rgba(255, 159, 64,0.3)", "rgba(255, 205, 86,0.3)", "rgba(75, 192, 192,0.3)", "rgba(54, 162, 235,0.3)", "rgba(153, 102, 255,0.3)"];
const legendLabels = ["Domaine 1", "Domaine 2", "Domaine 3", "Domaine 4", "Domaine 5", "Domaine 6"];
//const legendLabels = labels;
const config = {
    type: "polarArea",
    data: {
        labels: [legendLabels[0], legendLabels[1], legendLabels[2], legendLabels[3], legendLabels[4], legendLabels[5]],
        datasets: [
            {
                //data: [0, 80,0, 0, 40,0, 0, 54,0, 0, 62,0, 0, 71,0, 0, 45,0],
                data: data,
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
// Call drawLogo when the chart is first created
drawLogo2();

// Also call drawLogo when the window is resized, to ensure the logo stays in the correct position
window.addEventListener('resize', drawLogo2);

console.log('7. Canvas context:', ctxB);
console.log('8. Polar Risk mis à jour');
setTimeout(drawLogo2,100);
}

