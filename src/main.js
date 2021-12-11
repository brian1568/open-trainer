const { getContent } = require('./content-broker');

function main() {
   console.log(getContent());
}

module.exports = {
   main
}

if (require.main === module) {
   main();
}
