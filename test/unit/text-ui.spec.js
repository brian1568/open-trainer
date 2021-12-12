const {display} = require('../../src/text-ui');
const Chance = require('chance');
const chance = new Chance();

describe('Text UI - Unit', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log');
  });

  afterEach(() => {
    console.log.mockClear();
  });

  afterAll(() => {
    console.log.mockRestore();
  });

  it('should display text to stdout', () => {
    // arrange
    const outputText = `The ${chance.animal()} says: '${chance.sentence({words: 5})}'`;

    // act
    display(outputText);

    // assert
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(outputText);
  });
});
