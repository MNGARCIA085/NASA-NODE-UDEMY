const launchesDatabase = require('./launches.mongo');
const planets =  require('./planets.mongo');
const axios = require('axios');


// valor por defecto para el número de lanzamiento
const DEFAULT_FLIGHT_NUMBER = 100;


// obtener el último número de vuelo
async function getLatestFlightNumber(){
  const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber');
  // si no hay ninguno devuelvo el valor por defecto
  if (!latestLaunch){
      return DEFAULT_FLIGHT_NUMBER;
  }

  // sino devuelvo el que encontró
  return latestLaunch.flightNumber;

}


// un lanzamiento en particular
const launch = {
  mission:'dsfs', // name
  rocket:'dsfds', // rocket.name
  launchDate:new Date('December 17, 2020'), // date_local
  target:'32423', // no se encuentra en la API de Space X
  fligthNumber: 100, // se corresponde con flight_number en la API de Space X
  customer: ['NASA', 'ztm'], // con payload.customers para cada payload
  upcoming:true, // upcoming
  success:true // success
}

 
 

// guardo el primero con mongodb
saveLaunch(launch);




// cargamos los datos desde la API de Space X
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';
 
 
async function populateLaunches() {
 console.log('Downloading launch data...');
 const response = await axios.post(SPACEX_API_URL, {
   query: {},
   options: {
     pagination: false,
     populate: [
       {
         path: 'rocket',
         select: {
           name: 1
         }
       },
       {
         path: 'payloads',
         select: {
           'customers': 1
         }
       }
     ]
   }
 });

 if (response.status !== 200) {
  console.log('Problem downloading launch data');
  throw new Error('Launch data download failed');
}

  // preparar los datos desde la API
 
  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
  
    // obtenemos los clientes
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload) => {
      return payload['customers'];
    });
  
    // armamos el lanzamiento
    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers,
    };
  
    console.log(`${launch.flightNumber} ${launch.mission}`);

    await saveLaunch(launch);
  
  }

}


// saber si se cargó el primer lanzamiento
// si es así posiblemente estén todos
async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });
  if (firstLaunch) {
    console.log('Launch data already loaded!');
  } else {
    await populateLaunches();
  }
}



// obtener todos los lanzamientos
async function getAllLaunches(skip,limit){
  return await launchesDatabase.find( {}, {'_id':0, '__v':0} )
  .sort({ flightNumber : 1  })
  .skip(skip)
  .limit(limit);
}



// agregar un lanzamiento
async function scheduleNewLaunch(launch) { 

  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error('No matching planet found');
  }

  
  const newFlightNumber = await getLatestFlightNumber() + 1;
  
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['Zero to Mastery', 'NASA'],
    flightNumber: newFlightNumber,
  });
   await saveLaunch(newLaunch);
}




// guardar lanzamiento
async function saveLaunch(launch) {
  await launchesDatabase.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true,
  });
}


 //
 async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}


// si existe un lanzamiento con ese id
async function existsLaunchWithId(launchId) {
  try {
      return await findLaunch({
          flightNumber: launchId,
      });
  } catch (err){
      console.log(err);
  }
}



// cancelar un lanzamiento
async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne({
    flightNumber: launchId,
  }, {
    upcoming: false,
    success: false,
  });
   return aborted.modifiedCount === 1;
}






// exportamos para que se pueda usar desde otro lado
module.exports = {
    getAllLaunches,
    existsLaunchWithId,
    abortLaunchById,
    saveLaunch,
    scheduleNewLaunch,
    loadLaunchData
}
