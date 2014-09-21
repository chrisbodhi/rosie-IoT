var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var MealSchema  = new Schema({
  name: String,
  meal: {
    weight: Number,
    picture: String,
    time: Date
  },
});

module.exports = mongoose.model('Meal', MealSchema);