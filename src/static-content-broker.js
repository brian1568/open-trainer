const fs = require('fs');

function getTrainerName(path) {
  const trainerName = fs.readFileSync(path, 'utf8');

  return trainerName;
}

function getAvailableTrainers(directory) {
  const directoryEntries = fs.readdirSync(directory);
  const trainers = [];

  directoryEntries.forEach((entry) => {
    if (fs.lstatSync(`${directory}/${entry}`).isFile()) {
      trainers.push(getTrainerName(`${directory}/${entry}`));
    }
  });

  return trainers;
}

module.exports = {
  getAvailableTrainers,
};
