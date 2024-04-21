/**
 * CRI - 2024
 * Import des des modules utilisés par nodejs pour la partie serveur
 */
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import mariadb from 'mariadb';
import bodyParser from 'body-parser';
import path from 'path';
import https from 'https';
import fetch from 'node-fetch';
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


app.get('/env', (req, res) => {
    res.json({
        LS_API_USER: process.env.LS_API_USER,
        LS_API_PWD: process.env.LS_API_PWD
    });
});



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
//app.use('/njs', express.static('/app'));
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     next();
//   });

app.get('/sessionKeyDetails', (req, res) => {
    const url = 'https://ls.dumspiro.ch/index.php?r=admin/remotecontrol';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': '88'
        },
        body: JSON.stringify({method: 'get_session_key', params: [process.env.LS_API_USER, process.env.LS_API_PWD], id: 1})
    };

    fetch(url, options)
        .then(response => response.text())
        .then(body => {
            console.log('Response from ls.dumspiro.ch:', body);
            res.send(body);
        })
        .catch(error => {
            console.error('Problem with request:', error.message);
            res.status(500).send(error.message);
        });
});

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

// Creation de la connexion à sqlite3 - Database fait partie de sqlite3
const db = new sqlite3.Database('./dbs/data.db', (err) => {
    if (err) {
        return log(err.message);
    }
    log('Connected to the SQlite database.');
    db.run('CREATE TABLE IF NOT EXISTS user_data(name TEXT, timestamp INTEGER, ip TEXT)');
});

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

// Requête base locale sqlite3
app.get('/', (req, res) => {
    db.all('SELECT * FROM user_data', [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            log(row.name + "\t" + row.timestamp + "\t" + row.ip);
        });
    });
    res.send('Hello, CROC!');
});
// Heure du serveur (pour les pb de 2FA)
app.get('/time', (req, res) => {
    res.send(new Date().toISOString());
});
// Heure de la machine qui lance la page web (run du 2FA)
app.get('/db_cri', (req, res) => {
    res.send(process.env.DB_CRI);
});
app.post('/submit', (req, res) => {
    const name = req.body.name;
    const timestamp = Date.now();
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    // Alimente la base locale sqlite3 avec des données
    db.run(`INSERT INTO user_data(name, timestamp, ip) VALUES(?, ?, ?)`, [name, timestamp, `${userIP} / ${userAgent}`], function(err) {
        if (err) {
            return log(err.message);
        }
        log(`A row has been inserted with rowid ${this.lastID}`);
    });
    res.redirect(`/response_data?name=${encodeURIComponent(name)}`);
});
app.get('/response_data', async (req, res) => {
    let conn;
    try {
        const name = req.query.name;
        conn = await pool.getConnection();

        //Read the SQL query from the tk-ml.sql file
        const sqlQuery = fs.readFileSync('sql/tk-ml_perso.sql', 'utf8');
        const perso = await conn.query(sqlQuery, [name]);
        // valeurs par défaut pour la typologie choisie en lien avec le token pour le chart1
        const sqlQuery2 = fs.readFileSync('sql/tk-ml_prio.sql', 'utf8');
        const prio = await conn.query(sqlQuery2, [name]);
        // domaines selon la langue choisie
        const sqlQuery3 = fs.readFileSync('sql/tk-ml_labels.sql', 'utf8');
        const labels = await conn.query(sqlQuery3, [name]);
        const sqlQuery4 = fs.readFileSync('sql/tk-ml_data.sql', 'utf8');
        const data = await conn.query(sqlQuery4, [name]);
        res.send({perso: perso, prio: prio, labels: labels, data: data});
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