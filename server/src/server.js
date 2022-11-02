const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();
 
const app = require('./app'); // es la app de express

// importo la fn. de carga de planetas
const { loadPlanetsData } = require('./models/planets.model');
 
const PORT = process.env.PORT || 8000; // si no hay env será el 8000 por defecto
 

console.log('sadsaa',process.env.MONGO_URL);

const MONGO_URL = process.env.MONGO_URL;


const server = http.createServer(app);


async function startServer(){
    await mongoose.connect(MONGO_URL);
    //
    await loadPlanetsData();
    server.listen(PORT, () => {
        console.log(` Listening in the port ${PORT}  `)
    })
 }
  
  
  
 // chequeo la conexión
 mongoose.connection.once('open', ()=> {
    console.log('MongoDB ready');
 })
  
  
 // si hay errores
 mongoose.connection.on('error', (err) => {
    console.error(err);
 })
 
 
startServer();
 
