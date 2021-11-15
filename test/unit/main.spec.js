const {main} = require('../../src/main');
const {getContent} = require('../../src/content-broker');

jest.mock('../../src/content-broker');

describe('Main Unit Tests', () => {

   afterEach(() => {
      jest.resetAllMocks();
   });

   it('should call content-broker', () => {
      // act
      main();

      // assert
      expect(getContent).toBeCalledTimes(1);
   });

});
