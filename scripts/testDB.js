-- Active: 1709836768107@@dum@3306@lsCyberm
require('dotenv').config({ path: '/var_env/.env.txt' });
const express = require('express');
const mariadb = require('mariadb');

const PORT = process.env.PORT || 3718;
const IP = process.env.IP || '127.0.0.1';

// Initialize the MariaDB connection pool
const pool = mariadb.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

const app = express();

let currentName = 'your_test_value'; // Replace 'your_test_value' with the value you want to test

app.get('/response_data', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM lime_survey_983971 where `token` = ?", [currentName]);
        res.send(rows);
    } catch (err) {
        console.log('Error occurred while selecting from MariaDB: ' + err);
    } finally {
        if (conn) conn.release(); //release to pool
    }
});

app.listen(PORT, IP, () => {
    console.log(`Server running at http://${IP}:${PORT}/`);
});