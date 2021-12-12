const {display, displayAvailableContent} = require('../../src/text-ui');
const Chance = require('chance');
const chance = new Chance();

describe('Text UI - Unit', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockClear();
  });

  afterAll(() => {
    console.log.mockRestore();
  });

  it('should display available content', () => {
    // arrange
    const label = 'Available Content:';
    const content = ['horse', 'pig', 'whale'];

    // act
    displayAvailableContent(content);

    // assert
    expect(console.log).toHaveBeenNthCalledWith(1, label);

    const nthCallOffset = 2;
    for (let contentIndex = 0; contentIndex < content.length; contentIndex++) {
      expect(console.log).toHaveBeenNthCalledWith(
          nthCallOffset + contentIndex,
          `${contentIndex + 1}: ${content[contentIndex]}`);
    }
  });

  it('should display text to stdout', () => {
    // arrange
    const outputText =
      `The ${chance.animal()} says:` +
      `'${chance.sentence({words: 5})}'`;

    // act
    display(outputText);

    // assert
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(outputText);
  });
});
