const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const api = require('./routes/api');
 
const app = express();

// solucionando el eror de cors
app.use( cors ( {origin: 'http://localhost:3000' }) ); 

// va tan alto como se pueda
app.use(morgan('combined'));
 
app.use(express.json());
app.use(express.static(path.join('__dirname','..','public')));
 

// API
app.use('/v1',api);
// si tuviera otra versión tmb:   app.use('/v2',api2)




app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname,'..','public','index.html'));
})


 
module.exports = app;