const http = require('http');
 
const app = require('./app'); // es la app de express
 
const PORT = process.env.PORT || 8000; // si no hay env será el 8000 por defecto
 
const server = http.createServer(app);
 
server.listen(PORT, () => {
    console.log(` Listening in the port ${PORT}  `)
})
