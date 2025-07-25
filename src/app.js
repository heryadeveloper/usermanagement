const express = require('express');
const {postgres} = require('./config/pg');
const {mysql} = require('./config/mysql');
const routess = require('./routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// const corsOptions = {
//     origin: 'https://system.smknu-tulis.sch.id', // URL asal yang diizinkan
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Metode yang diizinkan
//     allowedHeaders: ['Content-Type', 'Authorization'], // Header yang diizinkan
//     credentials: true, // Mengizinkan pengiriman cookie atau kredensial
// };

app.use((req, _, next) => {
    req.postgres = postgres;
    next()
})

app.use((req, _, next) => {
    req.mysql = mysql;
    next()
})

app.get('/checkservice', (req, res) => {
    res.send('Service usermanagement is up -> V1.1');
})

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json());

// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));
app.use(cors());
app.use(cookieParser());

app.use('/v2', routess);
app.use('/upload', express.static(path.join(__dirname, '../public/upload')));

console.log('Serving static from:', path.join(__dirname, '../public'));


module.exports = app;
