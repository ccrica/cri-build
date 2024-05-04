//json data simple (data.js original)
window.onload = function() {
    setTokenexValue();
}


document.getElementById('submitForm').addEventListener('submit', function(event) {
// Prevent the form from being submitted normally
event.preventDefault();

// Get the form data
const token = document.getElementById('tkID').value;
// Fetch data from the server
fetch('/submit', {
method: 'POST',
headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
},
body: `tkID=${encodeURIComponent(token)}`,
})
.then(() => {
return fetch(`/response_data?tkID=${encodeURIComponent(token)}`);
})
.then(response => {
//console.log('Réponse du serveur :', response);
return response.json();
})
.then(data => {
console.log('Data from server:', data);
//données personnelles, mail et date de connexion
const dataPerso = data.perso[0];
// priorités en lien avec la tpyologie choisie
const domPrio = data.prio[0];
console.log('Priorités : ', domPrio);
// domaines dans la langue liée au token
const labs = data.labels;
console.log('Etiquettes : ', labs);
let percentages = domPrio.PourC.split('-').map(Number);
let cibles = percentages.map((perc, index) => ({
    Question: `DO0${index + 1}`,
    ciblePerc: perc
  }));
//console.log('pourcentages cibles : ', cibles);
// polarCible = domaines et valeurs cibles pour la typologie choisie
let polarCible = labs.map(lab => {
  let cible = cibles.find(cible => cible.Question === lab.Question);
  return {
    ...lab,
    ciblePerc: cible ? cible.ciblePerc : undefined
  };
});
//console.log('Données jointes : ', polarCible);

//début de récupération de données users et de calculs agrégés
// récupération des données pour le profil choisi (pas de filtre utilisateur juste profil)

const tklang = data.perso.startlanguage;
const txtL = data.txtlangue;
console.log('Textes : ', txtL);
const calcVals = data.calcVal;
console.log('Valeurs calculées : ', calcVals);
// transpose réponses utilisateur pour matching avec valeurs
const repses = Object.entries(data.repses[0])
  .filter(([Question, Cond]) => Cond !== '')
  .map(([Question, Cond]) => ({
    Question, 
    Cond,
    CondVal: isNaN(Number(Cond)) ? 1 : Number(Cond)
  }));
//console.log('Réponses with CondVal: ', repses);

const RepsesVal = repses.map(item => {
  const matchingCalcVal = calcVals.find(calcItem => {
    if (isNaN(Number(item.Cond))) {
      return calcItem.Question === item.Question && calcItem.Cond === item.Cond;
    } else {
      return calcItem.Question === item.Question;
    }
  });

  const matchingTxtL = txtL.find(txtItem => txtItem.CodeTxt === matchingCalcVal.CodeTxt);

  return {
    Question: item.Question,
    Cond: item.Cond,
    CondVal: item.CondVal,
    CodeTxt: matchingCalcVal.CodeTxt,
    Cond2: matchingCalcVal.Cond,
    Q2: matchingCalcVal.Question,
    QuestionLiee: matchingCalcVal.QuestionLiee,
    Tiers: matchingCalcVal.Tiers,
    DO01: matchingCalcVal.DO01,
    DO02: matchingCalcVal.DO02,
    DO03: matchingCalcVal.DO03,
    DO04: matchingCalcVal.DO04,
    DO05: matchingCalcVal.DO05,
    DO06: matchingCalcVal.DO06,
    lang: matchingTxtL ? matchingTxtL.lang : null,
    Chap1: matchingTxtL ? matchingTxtL.Chap1 : null,
    Chap2: matchingTxtL ? matchingTxtL.Chap2 : null,
    Logique: matchingTxtL ? matchingTxtL.Logique : null,
    Physique: matchingTxtL ? matchingTxtL.Physique : null,
    langRep: isNaN(Number(item.Cond)) ? (txtL.find(txtItem => txtItem.CodeTxt === item.Cond) || {}).lang : null
  };
});
console.log('Valeur pour les questions: ', RepsesVal);

const HierRepses = RepsesVal.map(item => {
  let mainTitle = "Risk";
  let secondLevel = item.Chap1 >= 1 && item.Chap1 <= 5 ? "Risks" : "Mesure";
  let childLevel = item.Chap2;
  let logique = item.Logique;
  let physique = item.Physique;
  let measures = {
    DO01: item.DO01,
    DO02: item.DO02,
    DO03: item.DO03,
    DO04: item.DO04,
    DO05: item.DO05,
    DO06: item.DO06,
    Tiers: item.Tiers
  };
  let condVal = item.CondVal;

  return {
    mainTitle,
    secondLevel,
    childLevel,
    logique,
    physique,
    measures,
    condVal,
    lang: item.lang,
    langRep: item.langRep
  };
});


const jsonString = JSON.stringify(HierRepses);
//console.log(jsonString);
console.log('Hierarchical data: ', HierRepses);


const RepsesAggreg = RepsesVal.reduce((acc, rep) => {
  if (rep.Cond !== '') {
    return {
      DO01: (acc.DO01 || 0) + (Number(rep.DO01) || 0),
      DO02: (acc.DO02 || 0) + (Number(rep.DO02) || 0),
      DO03: (acc.DO03 || 0) + (Number(rep.DO03) || 0),
      DO04: (acc.DO04 || 0) + (Number(rep.DO04) || 0),
      DO05: (acc.DO05 || 0) + (Number(rep.DO05) || 0),
      DO06: (acc.DO06 || 0) + (Number(rep.DO06) || 0),
    };
  }
  return acc;
}, {});
console.log('Réponses agrégées (RepsesAggreg):', RepsesAggreg);
const RepsesAggregTab = Object.entries(RepsesAggreg).map(([Question, Rep]) => ({
  Question,
  Rep
}));
console.log('Réponses agrégées (RepsesAggregTab):', RepsesAggregTab);

// const polarCibleReps = polarCible.map(item => {
//   const matchingItem = RepsesAggregTab.find(rep => rep.Question === item.Question);
//   return matchingItem ? { ...item, Rep: matchingItem.Rep } : item;
// });

const polarCibleReps = polarCible.map(item => {
  const matchingItem = RepsesAggregTab.find(rep => rep.Question === item.Question);
  if (matchingItem) {
    const Rep2 = Math.round(item.ciblePerc - matchingItem.Rep);
    return { ...item, Rep: matchingItem.Rep, Rep2: Rep2 };
  } else {
    return item;
  }
});

console.log('Aggregated Data (polarCiblesReps):', polarCibleReps);

// domaine choisi, nombre de personnes dans le foyer et d'enfants
const dta = data.data[0];
// textes pour la page dans la langue liée au token
const titres = data.dataTitres;
// Domaines dans l'ordre de priorité choisi dans le survey
const dtaDomaines = data.dataDom.flatMap(dom => 
  Object.values(dom).map(value => ({ Question: value }))
);
//console.log('Domaines : ', dtaDomaines);
const polarCibleTri = polarCibleReps.sort((a, b) => {
  const indexA = dtaDomaines.findIndex(dom => dom.Question === a.Question);
  const indexB = dtaDomaines.findIndex(dom => dom.Question === b.Question);
  return indexA - indexB;
});
console.log('Domaines triés (polarCibleTri) : ', polarCibleTri);

// Create a structured view of the data
const dataContainer = document.getElementById('dbData');
dataContainer.innerHTML = `
    <h2>${titres[0].Dtl1}</h2>
    <p>${titres[9].Dtl1} ${dataPerso.email} !</p>
    <p>${titres[11].Dtl1} : ${dataPerso.submitdate}</p>
    <p>${titres[2].Dtl1} : ${dataPerso.startlanguage}</p>
    <!--p>${titres[12].Dtl1} : ${domPrio.Prio}</p-->
    <!--p>${titres[3].Dtl1} :  ${domPrio.PourC}</p-->
    <!--p>${titres[5].Dtl1} : ${dta.typologie}</p-->
    <!--p>${titres[10].Dtl1} : ${polarCibleTri.map(item => item.Domaine).join(', ')}</p-->
    <!--p>Data : ${RepsesAggreg.DO01} - DO02: ${RepsesAggreg.DO02}</p-->
`;
//document.getElementById('responseReceived').textContent = "Rapport";

const titreGraph1 = document.getElementById('titreGraph1');
titreGraph1.textContent = titres[13].Dtl1;
const titrePivot = document.getElementById('titrePivot');
titrePivot.textContent = titres[14].Dtl1;

document.documentElement.lang = dataPerso.startlanguage;

// Assuming RepsesVal is an array of objects
let csvContent = '';
RepsesVal.forEach(rep => {
    let row = '';
    for (const key in rep) {
        row += `${rep[key]};`;
    }
    csvContent += row.slice(0, -1) + '\n'; // Remove trailing comma and add newline
});

// Create a Blob from the CSV content
const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

// Create a data URL from the Blob
const url = URL.createObjectURL(blob);

// Create a download link and append it to the div with id "RepsesVal"
const downloadLink = document.createElement('a');
downloadLink.href = url;
downloadLink.download = 'data.csv';
downloadLink.textContent = 'Download data';
document.getElementById('RepsesVal').innerHTML = '';
document.getElementById('RepsesVal').appendChild(downloadLink);


new WebDataRocks({
    container: "#pivotTable",
    toolbar: true,
    report: {
        dataSource: {
            data: RepsesVal // your data here
        },
        slice: {
            rows: [{ uniqueName: "Chap1" }],
            columns: [{ uniqueName: "[Measures]" }],
            measures: [
                { uniqueName: "DO01", aggregation: "sum" },
                { uniqueName: "DO02", aggregation: "sum" },
                { uniqueName: "DO03", aggregation: "sum" },
                { uniqueName: "DO04", aggregation: "sum" },
                { uniqueName: "DO05", aggregation: "sum" },
                { uniqueName: "DO06", aggregation: "sum" }
            ]
        }
    },
    customizeCell: function(cell, data) {
        if (data.isGrandTotalColumn && data.measure && !data.isTotal) {
            cell.text = data.measure.uniqueName;
        }
    }
});


const chartData = [0, polarCibleTri[0].Rep2,0, 0, polarCibleTri[1].Rep2,0, 0, polarCibleTri[2].Rep2,0, 0, polarCibleTri[3].Rep2,0, 0, polarCibleTri[4].Rep2,0, 0, polarCibleTri[5].Rep2,0];
//const chartprio = [percentages[0], percentages[1], percentages[2], percentages[3], percentages[4], percentages[5]];
console.log('chartData-Données pour le chart : ', chartData);
const chartprio = [polarCibleTri[0].ciblePerc, polarCibleTri[1].ciblePerc, polarCibleTri[2].ciblePerc, polarCibleTri[3].ciblePerc, polarCibleTri[4].ciblePerc, polarCibleTri[5].ciblePerc];
//console.log('Données pour le chart : ', chartprio);
//const chartLabels = labs.map(item => item.Domaine);
const chartLabels = [polarCibleTri[0].Domaine, polarCibleTri[1].Domaine, polarCibleTri[2].Domaine, polarCibleTri[3].Domaine, polarCibleTri[4].Domaine, polarCibleTri[5].Domaine];
//console.log('Etiquettes pour le chart : ', chartLabels);
createChart(chartData, chartLabels, chartprio, drawLogo2);

});
});

//aliemente la proposition de token sur la page du rapport
// à remplacer par un token explicitement "exemple"
function setTokenexValue() {
  const urlParams = new URLSearchParams(window.location.search);
  const tkIDFromUrl = urlParams.get('tkID');

  if (tkIDFromUrl) {
    const inputField = document.getElementById('tkID');
    if (inputField) {
      inputField.value = tkIDFromUrl;
    } else {
      console.error('Could not find element with id "tkID"');
    }
  } else {
    fetch('/tokenex')
    .then(response => response.json())
    .then(data => {
      const inputField = document.getElementById('tkID');
      if (inputField) {
        inputField.value = data.TOKENEX;
      } else {
        console.error('Could not find element with id "tkID"');
      }
    })
    .catch(error => {
      console.error('Problem with request:', error.message);
    });
  }
}

function drawLogo2() {
    //console.log('Fonction drawlogo2 appelée');
    const img = new Image();
    img.onload = function() {
    const placeChart = document.getElementById('chartRisk1');
    const ctxB = placeChart.getContext('2d');
        //Get the position and size of the chart
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
    //    console.log('3 à 6. Error loading image');
    };
    img.src = 'https://note.dumspiro.ch/images/logo_circle_2.svg'; // Change this to the path of your SVG file
    //console.log('3 à 6. Logo lu et chargé - Polar Risk', img);
  };

let PolarRisk;

function createChart(data, labels, domPrio, onComplete) {
Chart.register( ChartDataLabels );

const container = document.querySelector('.container-hidden');
if (container) {
  container.classList.remove('container-hidden');
  container.classList.add('container-visible');
}
if (PolarRisk) {
  PolarRisk.destroy();
}


const ctxB = document.getElementById('chartRisk1');
let cVide = 'rgba(0, 0, 0, 0)';
//import { recupResult } from './data.js';
//const legendLabels = recupResult.map(item => item.label);
const legendLabelColors = ["rgba(255, 99, 132,1)", "rgba(255, 159, 64,1)", "rgba(255, 205, 86,1)", "rgba(75, 192, 192,1)", "rgba(54, 162, 235,1)", "rgba(153, 102, 255,1)"];;
const legendLabelColorsFond = ["rgba(255, 99, 132,0.3)", "rgba(255, 159, 64,0.3)", "rgba(255, 205, 86,0.3)", "rgba(75, 192, 192,0.3)", "rgba(54, 162, 235,0.3)", "rgba(153, 102, 255,0.3)"];
//const legendLabels = ["Domaine 1", "Domaine 2", "Domaine 3", "Domaine 4", "Domaine 5", "Domaine 6"];
const legendLabels = labels;
console.log('createChart-Labels : ', legendLabels);
console.log('createChart-Data : ', data);
console.log('createChart-DomPrio : ', domPrio);
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
                   formatter: (value, context) => value, // + '%',
                   color: "#ffffff",
                   anchor: 'end',
                   backgroundColor: function(context) {
                    return context.dataset.backgroundColor;
                  },
                  borderColor: 'white',
                  borderRadius: 25,
                  borderWidth: 2,
                  color: 'white',
                  font: {
                    weight: 'bold'
                  }
                },
            },
            {
                helper: true,
                data: [56, 56, 56, 56, 56, 56], // leure de fond pour les domaines
                backgroundColor: [cVide, cVide, cVide,cVide, cVide, cVide],
                borderWidth: 0,
                datalabels: {
                   display: false
                }
            },
            {
              //helper: true,
              data: [domPrio[0], domPrio[1], domPrio[2], domPrio[3], domPrio[4], domPrio[5]],
              //data:  [100, 50, 50, 80, 90, 70],
              backgroundColor: [ legendLabelColorsFond[0], legendLabelColorsFond[1], legendLabelColorsFond[2],legendLabelColorsFond[3], legendLabelColorsFond[4], legendLabelColorsFond[5]],
              borderWidth: 0,
                datalabels: {
                  // valeur effective du domaine, démontrée en pourcent
                   formatter: (value, context) => value, // + '%',
                   color: "#ffffff",
                   anchor: 'end',
                   backgroundColor: function(context) {
                    return context.dataset.backgroundColor;
                  },
                  borderColor: 'white',
                  borderRadius: 25,
                  borderWidth: 2,
                  color: 'white',
                  font: {
                    weight: 'bold'
                  }
                }
          }
        ]
    },
    options: {
        layout: {
          padding: 10
        },
        scales: {
            r: {
                angleLines: {
                    display: false
                },
                grid: {
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
            max: 60
        },
        plugins: {
          legend:{ display: false},
            labels: {
              arc: true,
              fontColor: '#000',
              position: 'outside',
              fontSize: 16, fontWeight: 'bold',
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
PolarRisk = new Chart(ctxB, config);
// Call drawLogo when the chart is first created
drawLogo2();

// Also call drawLogo when the window is resized, to ensure the logo stays in the correct position
window.addEventListener('resize', drawLogo2);

//console.log('7. Canvas context:', ctxB);
//console.log('8. Polar Risk mis à jour');
setTimeout(drawLogo2,100);
}

