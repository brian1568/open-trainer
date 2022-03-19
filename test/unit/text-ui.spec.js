const {display, displayAvailableContent} = require('../../src/text-ui');
const Chance = require('chance');
const chance = new Chance();

function generateMockTrainers(numTrainers = chance.integer({min: 1, max: 10})) {
  const trainers = [];

  for (let i = 0; i < numTrainers; i++) {
    trainers.push({
      name: `trainer-${chance.word()}`,
    });
  }

  return trainers;
}

describe('Text UI - Unit', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    console.log.mockName('mocked-console.log');
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
    const trainers = generateMockTrainers();

    // act
    displayAvailableContent(trainers);

    // assert
    expect(console.log).toHaveBeenNthCalledWith(1, label);

    const nthCallOffset = 2;
    for (let trainerIndex = 0; trainerIndex < trainers.length; trainerIndex++) {
      expect(console.log).toHaveBeenNthCalledWith(
          nthCallOffset + trainerIndex,
          `${trainerIndex + 1}: ${trainers[trainerIndex].name}`);
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
