/**
 * CRI - 2024
 * Import des des modules utilisés par nodejs pour la partie serveur
 */
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
//import sqlite3 from 'sqlite3';
import mariadb from 'mariadb';
import bodyParser from 'body-parser';
import path from 'path';
//import https from 'https';
//import fetch from 'node-fetch';
// __dirname n'étant plus d'actualité dane le code moderne ??
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * initialisation des variables d'environnement + Express + IP et Port
 */
const result = dotenv.config({ path: '/var_env/ls/.env' });
    if (result.error) {throw result.error;}
const app = express();
const PORT = process.env.PORT;
const IP = process.env.HOST;

dotenv.config({ path: '/var_env/ls/.env' });



// a remplacer par token exemple dès que possible
app.get('/tokenex', (req, res) => {
    res.json({ TOKENEX: process.env.TOKENEX });
});


/**
 * utilisation de scripts en dehors du répertoire public et logguer certaines actions
 */
app.use('/js', express.static(path.join(__dirname, './scripts')));
const logStream = fs.createWriteStream('./logs/server.log', { flags: 'a' });

/**
Enregistre certains logs dans la base locale
But ici à l'avenir : pouvoir travailler avec des datas locales ou sur le serveur
 */
app.use(express.static(path.join(__dirname, 'public')));

function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}`;
    console.log(logMessage);
}

// Creation de la connexion à mariadb - createPool fait partie de mariadb
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

console.log(pool);

app.get('/checkdb', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        if (conn) {
            res.send('<h1>DB is connected!</h1>');
        } else {
            res.send('<h1>Failed to connect to DB.</h1>');
        }
    } catch (err) {
        res.send('<h1>Error occurred while connecting to DB: ' + err + '</h1>');
    } finally {
        if (conn) conn.release();
    }
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Heure du serveur (pour les pb de 2FA)
app.get('/time', (req, res) => {
    res.send(new Date().toISOString());
});
// Heure de la machine qui lance la page web (run du 2FA)
app.get('/db_cri', (req, res) => {
    res.send(process.env.DB_CRI);
});
// app.get('/submit', (req, res) => {
//     const tkID = req.query.tkID;
//     const timestamp = Date.now();
//     const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     const userAgent = req.headers['user-agent'];

//     // Check if tkID is a 15-character string with no spaces
//     if (!/^[\S]{15}$/.test(tkID)) {
//         return res.status(400).send('Invalid tkID');
//     }

//     res.redirect(`/response_data?tkID=${encodeURIComponent(tkID)}`);
// });

app.post('/submit', (req, res) => {
    const tkID = req.body.tkID;
    const timestamp = Date.now();
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Check if tkID is a 15-character string with no spaces
    if (!/^[\S]{15}$/.test(tkID)) {
        return res.status(400).send('Invalid tkID');
    }
    res.redirect(`/response_data?tkID=${encodeURIComponent(tkID)}`);
});

app.get('/response_data', async (req, res) => {
    let conn;
    try {
        const tkID = req.query.tkID;
        conn = await pool.getConnection();

        //Read the SQL query from the tk-ml.sql file
        const sqlQ1 = fs.readFileSync('sql/tk-ml_perso.sql', 'utf8');
        const perso = await conn.query(sqlQ1, [tkID]);
        const lang = perso[0].startlanguage; 
        // valeurs par défaut pour la typologie choisie en lien avec le token pour le chart1
        const sqlQ2 = fs.readFileSync('sql/tk-ml_prio.sql', 'utf8');
        const prio = await conn.query(sqlQ2, [tkID]);
        // domaines selon la langue choisie
        const sqlQ3 = fs.readFileSync('sql/tk-ml_labels.sql', 'utf8');
        const labels = await conn.query(sqlQ3, [tkID]);
        const sqlQ4 = fs.readFileSync('sql/tk-ml_data.sql', 'utf8');
        const data = await conn.query(sqlQ4, [tkID]);
        const sqlQ5 = fs.readFileSync('sql/tk-ml_dataDom.sql', 'utf8');
        const dataDom = await conn.query(sqlQ5, [tkID]);
        const sqlQ6 = fs.readFileSync('sql/tk-ml_titres.sql', 'utf8');
        const dataTitres = await conn.query(sqlQ6, [tkID]);
        const sqlQ7 = fs.readFileSync('sql/tk-ml_valeurs.sql', 'utf8');
        const calcVal = await conn.query(sqlQ7, [tkID]);
        const sqlQ8 = fs.readFileSync('sql/tk-ml_repses.sql', 'utf8');
        const repses = await conn.query(sqlQ8, [tkID]);
        const sqlQ9 = `SELECT CodeTxt, Chap1, Chap2, Logique, Physique, ${lang} as lang FROM lime_cyberm_txt;`;
        const txtlangue = await conn.query(sqlQ9);
        res.send({perso: perso, prio: prio, labels: labels, data: data, dataDom: dataDom, dataTitres: dataTitres, calcVal: calcVal, repses: repses, txtlangue: txtlangue});

        // ligne pour tester une requête seule
        //res.send(data);
    } catch (err) {
        log('Error occurred while selecting from MariaDB: ' + err);
    } finally {
        if (conn) conn.release();
    }
    
});


app.listen(PORT, IP, () => {
    log(`Server running at http://${IP}:${PORT}/`);
});