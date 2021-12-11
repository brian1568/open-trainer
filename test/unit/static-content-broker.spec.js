const {getContent} = require('../../src/static-content-broker');

describe('Content Broker Unit Tests', () => {

   it('should return a value', () => {
      // act
      const result = getContent();

      // assert
      expect(result).toBeDefined();
   });

});