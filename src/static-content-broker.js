const fs = require('fs');

function getTrainerName(path) {
   const trainerName = fs.readFileSync(path, 'utf8');

   return trainerName;
}

function getAvailableTrainers(directory) {
   const trainerFiles = fs.readdirSync(directory);
   const trainers = [];
   
   trainerFiles.forEach((filename) => {
      trainers.push(getTrainerName(`${directory}/${filename}`));
   });

   return trainers;
}

module.exports = {
   getAvailableTrainers
};