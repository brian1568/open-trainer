const { getAvailableTrainers } = require('./static-content-broker');
const { display } = require('./text-ui');

function main() {
   const content = getAvailableTrainers();

   display('Available Content:');
   display(content);
}

module.exports = {
   main
}

if (require.main === module) {
   main();
}
