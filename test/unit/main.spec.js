const {main} = require('../../src/main');
const config = require('config');
const {getAvailableTrainers} = require('../../src/static-content-broker');
const {displayAvailableContent} = require('../../src/text-ui');
const Chance = require('chance');
const chance = new Chance();

jest.mock('../../src/static-content-broker');
getAvailableTrainers.mockName('mocked-getAvailableTrainers');

jest.mock('../../src/text-ui');
displayAvailableContent.mockName('mocked-displayAvailableContent');

function generateMockAvailableTrainers(
    numTrainers = chance.integer({min: 1, max: 5})) {
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
    const trainers = generateMockAvailableTrainers();

    getAvailableTrainers.mockReturnValue(trainers);

    // act
    main();

    // assert
    expect(getAvailableTrainers).toBeCalledTimes(1);
    expect(getAvailableTrainers).toHaveBeenCalledWith(directory);

    expect(displayAvailableContent).toHaveBeenCalledTimes(1);
    expect(displayAvailableContent).toHaveBeenCalledWith(trainers);
  });
});
