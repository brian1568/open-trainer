const config = require('config');
const { getAvailableTrainers } = require('./static-content-broker');
const { display } = require('./text-ui');

function main() {
   const directory = config.get('trainerDirectory');
   const content = getAvailableTrainers(directory);

   display('Available Content:');
   display(content);
}

module.exports = {
   main
}

if (require.main === module) {
   main();
}
