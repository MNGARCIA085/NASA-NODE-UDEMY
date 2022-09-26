const http = require('http');
 
const app = require('./app'); // es la app de express

// importo la fn. de carga de planetas
const { loadPlanetsData } = require('./models/planets.model');
 
const PORT = process.env.PORT || 8000; // si no hay env será el 8000 por defecto
 
const server = http.createServer(app);


// ahora esperamos que la funci[on de carga de planetas se complete antes 
// escuchar y responder solicitudes
async function startServer(){
    console.log('iniciando fds');
    await loadPlanetsData();
    server.listen(PORT, () => {
        console.log(` Listening in the port ${PORT}  `)
    })
}
 
startServer();
 
