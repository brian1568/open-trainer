const {getContent} = require('../../src/content-broker');

describe('Content Broker Unit Tests', () => {

   it('should return a value', () => {
      // act
      const result = getContent();

      // assert
      expect(result).toBeDefined();
   });

});