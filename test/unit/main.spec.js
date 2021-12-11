const {main} = require('../../src/main');
const {getContent} = require('../../src/content-broker');
const Chance = require('chance');
const chance = new Chance();

jest.mock('../../src/content-broker');

describe('Main Unit Tests', () => {
   afterEach(() => {
      jest.resetAllMocks();
   });

   it('should call content-broker', () => {
      // arrange
      getContent.mockReturnValue(chance.animal());

      // act
      main();

      // assert
      expect(getContent).toBeCalledTimes(1);
   });
});
