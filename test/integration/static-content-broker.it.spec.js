const config = require('config');
const {getAvailableTrainers} = require('../../src/static-content-broker');
const fs = require('fs');
const Chance = require('chance');
const chance = new Chance();

describe('Static Content Broker - Integration', () => {

   beforeAll(() => {
      //cleanupTrainerFiles();
   })

   it('should find trainer in directory', () => {
      // arrange
      const directory = config.get('trainerDirectory');
      const expectedResult = ['Bar Trainer', 'Foo Trainer'];

      // act
      const result = getAvailableTrainers(directory);

      // assert
      expect(result).toBeDefined();
      expect(result).toEqual(expectedResult);
   });

   it('should ignore directories adjacent to trainer files', () => {
      // arrange
      const directory = config.get('trainerDirectory');

      // act
      const result = getAvailableTrainers(directory);

      // assert
      expect(result).toBeDefined();
   });
});