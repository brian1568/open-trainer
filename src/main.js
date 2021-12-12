const config = require('config');
const {getAvailableTrainers} = require('./static-content-broker');
const {displayAvailableContent} = require('./text-ui');

function main() {
  const directory = config.get('trainerDirectory');
  const trainers = getAvailableTrainers(directory);

  displayAvailableContent(trainers);
}

module.exports = {
  main,
};

if (require.main === module) {
  main();
}
