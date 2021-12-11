const {main} = require('../../src/main');
const config = require('config');
const {getAvailableTrainers} = require('../../src/static-content-broker');
const {display} = require('../../src/text-ui');
const Chance = require('chance');
const chance = new Chance();

jest.mock('../../src/static-content-broker');
jest.mock('../../src/text-ui');

describe('Main Unit Tests', () => {
   afterEach(() => {
      jest.resetAllMocks();
   });

   it('should get and display content', () => {
      // arrange
      const directory = config.get('trainerDirectory');
      const label = 'Available Content:';
      const content = chance.animal();
      getAvailableTrainers.mockReturnValue(content);
      getAvailableTrainers.mockName('mocked-getAvailableTrainers');
      display.mockName('mocked-display');

      // act
      main();

      // assert
      expect(getAvailableTrainers).toBeCalledTimes(1);
      expect(getAvailableTrainers).toHaveBeenCalledWith(directory);
      expect(display).toHaveBeenCalledTimes(2);
      expect(display).toHaveBeenNthCalledWith(1, label);
      expect(display).toHaveBeenNthCalledWith(2, content);
   });
});
