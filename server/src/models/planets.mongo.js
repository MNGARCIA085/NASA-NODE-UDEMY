const mongoose = require('mongoose');
 
const planetSchema = new mongoose.Schema({
 keplerName: {
   type: String,
   required: true,
 }
});
 
// Connects planetSchema with the "planets" collection
module.exports = mongoose.model('Planet', planetSchema);


//Debo ser coherente en el FE (le puse keplerName en vez de kepler_name)

