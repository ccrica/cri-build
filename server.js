// server.js

require('dotenv').config({ path: '/var_env/ls/.env.txt' });
const express = require('express');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const mariadb = require('mariadb');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const PORT = process.env.PORT;
const IP = process.env.IP;

console.log("DB_CRI:", process.env.DB_CRI);
app.use('/js', express.static(path.join(__dirname, './scripts')));

const result = require('dotenv').config({ path: '/var_env/ls/.env.txt' });
if (result.error) {
    throw result.error;
}



const logStream = fs.createWriteStream('./logs/server.log', { flags: 'a' });
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}`;
    console.log(logMessage);
    logStream.write(logMessage + '\n');
}

const pool = mariadb.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

const db = new sqlite3.Database('./dbs/data.db', (err) => {
    if (err) {
        return log(err.message);
    }
    log('Connected to the SQlite database.');
    db.run('CREATE TABLE IF NOT EXISTS user_data(name TEXT, timestamp INTEGER, ip TEXT)');
});

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/time', (req, res) => {
    res.send(new Date().toISOString());
});

app.get('/db_cri', (req, res) => {
    res.send(process.env.DB_CRI);
});

app.post('/submit', (req, res) => {
    const name = req.body.name;
    const timestamp = Date.now();
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

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

        // Read the SQL query from the tk-ml.sql file
        const sqlQuery = fs.readFileSync('sql/tk-ml.sql', 'utf8');

        const rows = await conn.query(sqlQuery, [name]);
        res.send(rows);
    } catch (err) {
        log('Error occurred while selecting from MariaDB: ' + err);
    } finally {
        if (conn) conn.release();
    }
});


app.listen(PORT, IP, () => {
    log(`Server running at http://${IP}:${PORT}/`);
});