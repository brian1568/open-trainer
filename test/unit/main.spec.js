const {main} = require('../../src/main');
const config = require('config');
const {getAvailableTrainers} = require('../../src/static-content-broker');
const {display} = require('../../src/text-ui');
const Chance = require('chance');
const chance = new Chance();

jest.mock('../../src/static-content-broker');
jest.mock('../../src/text-ui');

function generateMockAvailableTrainers(numTrainers = chance.integer({min: 1, max: 5})) {
  const trainers = [];

  for (i = 0; i < numTrainers; i++) {
    trainers.push(`trainer-${chance.animal()}`);
  }

  return trainers;
}

describe('Main Unit Tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get and display content', () => {
    // arrange
    const directory = config.get('trainerDirectory');
    const label = 'Available Content:';
    const trainers = generateMockAvailableTrainers();

    getAvailableTrainers.mockName('mocked-getAvailableTrainers');
    getAvailableTrainers.mockReturnValue(trainers);
    display.mockName('mocked-display');

    // act
    main();

    // assert
    expect(getAvailableTrainers).toBeCalledTimes(1);
    expect(getAvailableTrainers).toHaveBeenCalledWith(directory);

    expect(display).toHaveBeenCalledTimes(1 + trainers.length);
    expect(display).toHaveBeenNthCalledWith(1, label);

    const nthCallOffset = 2;
    for (let trainerIndex = 0; trainerIndex < trainers.length; trainerIndex++) {
      expect(display).toHaveBeenNthCalledWith(
          nthCallOffset + trainerIndex,
          `${trainerIndex + 1}: ${trainers[trainerIndex]}`);
    }

    // expect(display).toHaveBeenNthCalledWith(2, trainers[0]);
    // expect(display).toHaveBeenNthCalledWith(2, trainers[0]);
  });
});
