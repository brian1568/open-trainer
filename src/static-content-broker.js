const fs = require('fs');

function loadTrainer(path) {
  const trainerJson = fs.readFileSync(path, 'utf8');

  return JSON.parse(trainerJson);
}

function getAvailableTrainers(directory) {
  const directoryEntries = fs.readdirSync(directory);
  const trainers = [];

  directoryEntries.forEach((entry) => {
    if (fs.lstatSync(`${directory}/${entry}`).isFile()) {
      trainers.push(loadTrainer(`${directory}/${entry}`));
    }
  });

  return trainers;
}

module.exports = {
  getAvailableTrainers,
};
