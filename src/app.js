const express = require('express');
const {postgres} = require('./config/pg');
const routess = require('./routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

app.use((req, _, next) => {
    req.postgres = postgres;
    next()
})

app.get('/checkservice', (req, res) => {
    res.send('Service usermanagement is up -> V1.1');
})

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json());

app.use(cors());
app.use(cookieParser());

app.use('/v2', routess);

// // Middleware untuk melayani file build React
// app.use(express.static(path.join(__dirname, '../build'))); // arahkan ke folder build

// // Semua permintaan selain API akan di-redirect ke index.html
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../build', 'index.html'));
// });



module.exports = app;
