const {getAvailableTrainers} = require('../../src/static-content-broker');
const fs = require('fs');
const Chance = require('chance');
const chance = new Chance();

jest.mock('fs');

// For now, structure of JSON file just contains trainer name
function generateMockTrainerFileContent(name) {
   return name;
}

function generateMockFsStatsEntry(isDirectory) {
   return {
      isFile: () => {
         return !isDirectory;
      }
   };
}

// Generate random purely mocked trainer files in specified directory
// When numDirectories > 0, will mix in that many directories
function arrangeMockStaticTrainers(
   directory, numTrainers = chance.integer({min: 1, max: 20}), numDirectories = 0) {
   const mockTrainerNames = [];
   const mockTrainerFileContentByPath = {};
   const mockDirectoryContent = [];
   const mockFsStatsEntriesByPath = {};

   for (let i = 0; i < numTrainers; i++) {
      let trainerName = `trainerName-${chance.word()}`;
      let trainerFilename = `${chance.word()}-trainer.json`;
      let trainerPath = `${directory}/${trainerFilename}`;

      mockTrainerNames.push(trainerName);
      mockDirectoryContent.push(trainerFilename);
      mockTrainerFileContentByPath[trainerPath] = generateMockTrainerFileContent(trainerName);

      mockFsStatsEntriesByPath[trainerPath] = generateMockFsStatsEntry(false);
   }

   for (let j = 0; j < numDirectories; j++) {
      let directoryName = `${chance.word()}-directory`;
      let directoryPath = `${directory}/${directoryName}`;

      mockDirectoryContent.push(directoryName);
      mockTrainerFileContentByPath[directoryPath] = 'This is a directory, not a file!';

      mockFsStatsEntriesByPath[directoryPath] = generateMockFsStatsEntry(true);
   }

   fs.readdirSync.mockName('mocked-readdirSync');
   fs.readdirSync.mockReturnValue(mockDirectoryContent);

   fs.readFileSync.mockName('mocked-readdirSync');
   fs.readFileSync.mockImplementation((path) => {
      const entry = mockTrainerFileContentByPath[path];

      if (entry.endsWith('-directory')) {
         throw new Error(`'${path}' is not a file!`);
      }

      return entry;
   });

   fs.lstatSync.mockName('mocked-lstatSync');
   fs.lstatSync.mockImplementation((name) => {
      return mockFsStatsEntriesByPath[name];
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

   it('should ignore directories in same directory as trainers', () => {
      // arrange
      const directory = `some-directory-${chance.word()}`;
      const numTrainersToMock = chance.integer({min: 1, max: 5});
      const numDirectoriesToIgnore = chance.integer({min: 1, max: 5});
      const availableTrainers = arrangeMockStaticTrainers(directory, numTrainersToMock, numDirectoriesToIgnore);

      // act
      const result = getAvailableTrainers(directory);

      // assert
      expect(availableTrainers.length).toEqual(numTrainersToMock);

      expect(result).toBeDefined();
      //expect(result.length).toEqual(numTrainersToMock);
      expect(result.sort()).toEqual(availableTrainers.sort());
   });
});