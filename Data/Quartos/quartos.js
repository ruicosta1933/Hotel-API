let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let QuartoSchema = new Schema({
   number: { type: Number, required: true, unique: true },
   type: { type: String, required: true },
   bedroomsNumber: { type: Number, required: true },
   capacity: { type: Number, required: true },
   information: { type: String, required: true },
   valueNight: { type: Number, required: true },
   image: { type: String, required: true, unique:true},
}); 

let Quarto = mongoose.model('Quartos', QuartoSchema);

module.exports = Quarto;