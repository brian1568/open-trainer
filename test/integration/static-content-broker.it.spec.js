const config = require('config');
const {getAvailableTrainers} = require('../../src/static-content-broker');
const fs = require('fs');
const Chance = require('chance');
const chance = new Chance();

describe('Static Content Broker - Integration', () => {
  beforeAll(() => {
    // cleanupTrainerFiles();
  });

  it('should find trainer in directory', () => {
    // arrange
    const directory = config.get('trainerDirectory');
    const directoryEntries = fs.readdirSync(directory);
    const trainerEntries = directoryEntries.filter((entry) => {
      return entry.endsWith('.json');
    });
    const numJsonFiles = trainerEntries.length;

    // act
    const result = getAvailableTrainers(directory);

    // assert
    expect(result).toBeDefined();
    expect(result.length).toEqual(numJsonFiles);
  });
});
