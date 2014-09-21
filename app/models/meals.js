var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var MealSchema  = new Schema({
  name: String,
  weight: String,
  picture: String,
  taken: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Meal', MealSchema);