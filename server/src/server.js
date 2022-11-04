const http = require('http');
const { mongoConnect} = require('./services/mongo');
const { loadLaunchData } = require('./models/launches.model');

const app = require('./app'); // es la app de express

// importo la fn. de carga de planetas
const { loadPlanetsData } = require('./models/planets.model');
 
const PORT = process.env.PORT || 8000; // si no hay env será el 8000 por defecto
 

console.log('sadsaa',process.env.MONGO_URL);

const MONGO_URL = process.env.MONGO_URL;


const server = http.createServer(app);


async function startServer(){
   // me conecto a mongo
   await mongoConnect();
   // cargo los planetas
   await loadPlanetsData();

    // cargo los datos desde la API de Space X
    await loadLaunchData();

   server.listen(PORT, () => {
       console.log(` Listening in the port ${PORT}  `)
   })
}

  
startServer();
 
