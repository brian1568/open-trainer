const {getAvailableTrainers} = require('../../src/static-content-broker');
const fs = require('fs');
const Chance = require('chance');
const chance = new Chance();

jest.mock('fs');

// For now, structure of JSON file just contains trainer name
function generateMockTrainerFileContent(name) {
   return name;
}

function arrangeMockStaticTrainers(
   directory, numTrainers = chance.integer({min: 1, max: 5})) {
   const mockTrainerNames = [];
   const mockTrainerFileContentByPath = {};
   const mockDirectoryContent = [];

   for (let i = 0; i < numTrainers; i++) {
      let trainerName = `trainerName-${chance.word()}`;
      let trainerFilename = `${chance.word()}-trainer.json`;
      let trainerPath = `${directory}/${trainerFilename}`;

      mockTrainerNames.push(trainerName);
      mockDirectoryContent.push(trainerFilename);
      mockTrainerFileContentByPath[trainerPath] = generateMockTrainerFileContent(trainerName);
   }

   fs.readdirSync.mockName('mocked-readdirSync');
   fs.readdirSync.mockReturnValue(mockDirectoryContent);

   fs.readFileSync.mockName('mocked-readdirSync');
   fs.readFileSync.mockImplementation((path) => {
      return mockTrainerFileContentByPath[path];
   });

   return chance.shuffle(mockTrainerNames);
}

describe('Static Content Broker - Unit', () => {

   afterEach(() => {
      jest.resetAllMocks();
   });

   it('should return array of trainers found in specified directory', () => {
      // arrange
      const directory = `some-directory-${chance.word()}`;
      const availableTrainers = arrangeMockStaticTrainers(directory);
      const numTrainers = availableTrainers.length;

      // act
      const result = getAvailableTrainers(directory);

      // assert
      expect(result).toBeDefined();
      expect(result.length).toEqual(numTrainers);
      
      expect(fs.readdirSync).toHaveBeenCalledTimes(1);
      expect(fs.readdirSync).toHaveBeenCalledWith(directory);
      expect(fs.readFileSync).toHaveBeenCalledTimes(numTrainers);

      const pathIndex = 0;
      const optionsIndex = 1;
      for (let i = 0; i < numTrainers; i++) {
         expect(fs.readFileSync.mock.calls[i][pathIndex].startsWith(directory)).toEqual(true);
         expect(fs.readFileSync.mock.calls[i][optionsIndex]).toEqual('utf8');
      }

      expect(result.sort()).toEqual(availableTrainers.sort());
   });

});