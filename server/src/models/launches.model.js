// mapa que contendrá todos los lanzamientos
const launches = new Map();
 
 
// un lanzamiento en particular
const launch = {
    mission:'dsfs',
    rocket:'dsfds',
    launchDate:new Date('December 27, 2030'),
    destination:'32423',
    fligthNumber: 100, // id único
    customer: ['NASA', 'ztm'],
    upcoming:true,
    succes:true
}
 
 
// le ingresamos el lanzamiento particular a launches
launches.set(launch.fligthNumber,launch); // par clave-valor
 
 
// exportamos para que se pueda usar desde otro lado
module.exports = {
    launches
}
