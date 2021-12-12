function display(text) {
  console.log(text);
}

function displayAvailableContent(contentArray) {
  console.log('Available Content:');

  contentArray.forEach((item, index) => {
    console.log(`${index + 1}: ${item.name}`);
  });
}

module.exports = {
  display,
  displayAvailableContent,
};
