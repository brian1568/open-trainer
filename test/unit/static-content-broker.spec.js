const {getAvailableTrainers} = require('../../src/static-content-broker');
const fs = require('fs');
const Chance = require('chance');
const chance = new Chance();

jest.mock('fs');

function arrangeMockStaticTrainers(numTrainers = chance.integer({min: 1, max: 5})) {
   const mockTrainerNames = [];
   const mockTrainersByFilename = {};
   const mockDirectoryContent = [];

   for (let i = 0; i < numTrainers; i++) {
      let trainerName = `trainerName-${chance.word()}`;
      let trainerFilename = `${chance.word()}-trainer.json`;

      mockTrainerNames.push(trainerName);
      mockTrainersByFilename[trainerFilename] = trainerName;
      mockDirectoryContent.push(trainerFilename);
   }

   fs.readdirSync.mockName('mocked-readdirSync');
   fs.readdirSync.mockReturnValue(mockDirectoryContent);

   fs.readFileSync.mockName('mocked-readdirSync');
   fs.readFileSync.mockImplementation((filename) => {
      // For now, static trainer files contain 1 thing: their name
      return mockTrainersByFilename[filename];
   });

   return chance.shuffle(mockTrainerNames);
}

describe('Content Broker Unit Tests', () => {

   afterEach(() => {
      jest.resetAllMocks();
   });

   it('should return array of trainers found in specified directory', () => {
      // arrange
      const directory = `some-directory-${chance.word()}`;
      const availableTrainers = arrangeMockStaticTrainers();
      const numTrainers = availableTrainers.length;

      // act
      const result = getAvailableTrainers(directory);

      // assert
      expect(result).toBeDefined();
      expect(fs.readdirSync).toHaveBeenCalledTimes(1);
      expect(fs.readdirSync).toHaveBeenCalledWith(directory);
      expect(fs.readFileSync).toHaveBeenCalledTimes(numTrainers);      
      expect(result.sort()).toEqual(availableTrainers.sort());
   });

});