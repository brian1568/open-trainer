const Chance = require('chance');
const chance = new Chance();

module.exports = {
   trainerDirectory: `trainerDirectory-${chance.word()}`
}