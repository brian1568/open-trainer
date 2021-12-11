const { getContent } = require('./content-broker');
const { display } = require('./text-ui');

function main() {
   const content = getContent();

   display('Available Content:');
   display(content);
}

module.exports = {
   main
}

if (require.main === module) {
   main();
}
