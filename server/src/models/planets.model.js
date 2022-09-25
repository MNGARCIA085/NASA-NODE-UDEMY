const path = require('path');
const {parse} = require('csv-parse');
const fs = require('fs');
 
const habitablePlanets = [];
 
function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}
 
 
function loadPlanetsData() {
    // uso una promise para la carga de datos
    return new Promise( (resolve, reject)  => {
        fs.createReadStream( path.join('__dirname','..','..','server','data','kepler_data.csv' ))
        .pipe(parse({
            comment: '#',
            columns: true,
        }))
        .on('data', (data) => {
            if (isHabitablePlanet(data)) {
                habitablePlanets.push(data);//{'name':data.kepler_name}
            }
        })
        .on('error', (err) => {
            console.log(err);
            reject(err);
        })
        .on('end', () => {
            console.log(`${habitablePlanets.length} habitable planets found!`);
            console.log(habitablePlanets);
            resolve();
        });
 
    })
}
 
 
 
 
  module.exports = {
    loadPlanetsData,
    planets:habitablePlanets
  }