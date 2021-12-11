const {getAvailableTrainers} = require('../../src/static-content-broker');

describe('Content Broker Unit Tests', () => {

   it('should return a value', () => {
      // act
      const result = getAvailableTrainers();

      // assert
      expect(result).toBeDefined();
   });

});