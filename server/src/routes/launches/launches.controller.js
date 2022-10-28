//const {launches} = require('../../models/launches.model');
const {
    getAllLaunches ,
    addNewLaunch
} = require('../../models/launches.model');


/**
function getAllLaunches (req, res) {
    return res.status(200).json(Array.from(launches.values()));
}
*/

function httpGetAllLaunches (req, res) {
    return res.status(200).json(getAllLaunches());
}
 
 
 
function httpAddNewLaunch(req,res){
    const launch = req.body;


    // valido datos obligatorios
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.destination ){
        return res.status(400).json({
            error: 'Missing required fields'
        })
    }


    // convierto a fecha launchDate (pues llega como str)
    launch.launchDate = new Date(launch.launchDate);
    // agrego
    addNewLaunch(launch);
    // respuesta
    res.status(200).json(launch);
}

 
module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch
}




