//const {launches} = require('../../models/launches.model');
const {
    getAllLaunches ,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById
} = require('../../models/launches.model');

const {
  getPagination,
} = require('../../services/query');



// obtener todos los lanzamientos
async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
}


// agregar un nuevo lanzamiento 
async function httpAddNewLaunch(req,res){
    const launch = req.body;
    // valido datos obligatorios
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target ){
        return res.status(400).json({
            error: 'Missing required fields'
        })
    }
    // convierto a fecha launchDate (pues llega como str)
    launch.launchDate = new Date(launch.launchDate);
    // agrego
    await scheduleNewLaunch(launch);
    // respuesta
    res.status(201).json(launch);
}

 
// delete
async function httpAbortLaunch(req, res) {
 
    const launchId = Number(req.params.id);
    console.log(launchId);
     // chequeo que exista
    const existsLaunch = await existsLaunchWithId(launchId);
    if (!existsLaunch) {
      return res.status(404).json({
        error: 'Launch not found',
      });
    }
     // si no se pudo cancelar
    const aborted = await abortLaunchById(launchId);
    if (!aborted) {
      return res.status(400).json({
        error: 'Launch not aborted',
      });
    }
     // si todo salio bien
    return res.status(200).json({
      ok: true,
    });
  }
 




 
module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}




