var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var MealSchema  = new Schema({
  name: String,
  weight: String,
  taken: { type: Date, default: Date.now} // this does *not* save the datetime at time of object creation; it is the current time
});

module.exports = mongoose.model('Meal', MealSchema);