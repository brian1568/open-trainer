const fs = require('fs');

function getTrainerName(filename) {
   const trainerName = fs.readFileSync(filename);

   return trainerName;
}

function getAvailableTrainers(directory) {
   const trainerFiles = fs.readdirSync(directory);
   const trainers = [];
   
   trainerFiles.forEach((filename) => {
      trainers.push(getTrainerName(filename));
   });

   return trainers;
}

module.exports = {
   getAvailableTrainers
};