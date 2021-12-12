const config = require('config');
const {getAvailableTrainers} = require('./static-content-broker');
const {display} = require('./text-ui');

function main() {
  const directory = config.get('trainerDirectory');
  const trainers = getAvailableTrainers(directory);

  display('Available Content:');

  for (let i = 0; i < trainers.length; i++) {
    display(`${i + 1}: ${trainers[i]}`);
  }
}

module.exports = {
  main,
};

if (require.main === module) {
  main();
}
