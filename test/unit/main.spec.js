const {main} = require('../../src/main');
const {getContent} = require('../../src/content-broker');
const {display} = require('../../src/text-ui');
const Chance = require('chance');
const chance = new Chance();

jest.mock('../../src/content-broker');
jest.mock('../../src/text-ui');

describe('Main Unit Tests', () => {
   afterEach(() => {
      jest.resetAllMocks();
   });

   it('should get and display content', () => {
      // arrange
      const label = 'Available Content:';
      const content = chance.animal();
      getContent.mockReturnValue(content);
      getContent.mockName('mocked-getContent');
      display.mockName('mocked-display');

      // act
      main();

      // assert
      expect(getContent).toBeCalledTimes(1);
      expect(display).toHaveBeenCalledTimes(2);
      expect(display).toHaveBeenNthCalledWith(1, label);
      expect(display).toHaveBeenNthCalledWith(2, content);
   });
});
