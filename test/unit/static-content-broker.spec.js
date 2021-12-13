const {getAvailableTrainers} = require('../../src/static-content-broker');
const fs = require('fs');
const Chance = require('chance');
const chance = new Chance();

jest.mock('fs');
fs.readdirSync.mockName('mocked-readdirSync');
fs.readFileSync.mockName('mocked-readdirSync');
fs.lstatSync.mockName('mocked-lstatSync');

function generateMockTrainerFileContent(name) {
  const trainer = {
    name,
  };

  return JSON.stringify(trainer);
}

function generateMockFsStatsEntry(isDirectory) {
  return {
    isFile: () => {
      return !isDirectory;
    },
  };
}

function generateMockFileSystem() {
  return {
    directory: `some-directory-${chance.word()}`,
  };
}

// Generate random purely mocked trainer files in specified directory
// When numDirectories > 0, will mix in that many directories
function arrangeMockStaticTrainers(
    mockFileSystem,
    numTrainers = chance.integer({min: 1, max: 20}),
    numDirectories = 0) {
  const mockTrainers = [];
  const mockTrainerFileContentByPath = {};
  const mockDirectoryContent = [];
  const mockFsStatsEntriesByPath = {};
  let fileContent;

  const uniqueTrainerNames = chance.unique(() => {
    return `trainerName-${chance.word()}`;
  }, numTrainers);
  const uniqueTrainerFilenames = chance.unique(() => {
    return `${chance.word()}-trainer.json`;
  }, numTrainers);

  for (let i = 0; i < numTrainers; i++) {
    const trainerName = uniqueTrainerNames[i];
    const trainerFilename = uniqueTrainerFilenames[i];
    const trainerPath = `${mockFileSystem.directory}/${trainerFilename}`;

    mockDirectoryContent.push(trainerFilename);
    fileContent = generateMockTrainerFileContent(trainerName);
    mockTrainerFileContentByPath[trainerPath] = fileContent;
    mockTrainers.push(JSON.parse(fileContent));

    mockFsStatsEntriesByPath[trainerPath] = generateMockFsStatsEntry(false);
  }

  const uniqueTrainerDirectoryNames = chance.unique(() => {
    return `${chance.word()}-directory`;
  }, numTrainers);

  for (let j = 0; j < numDirectories; j++) {
    const directoryName = uniqueTrainerDirectoryNames[j];
    const directoryPath = `${mockFileSystem.directory}/${directoryName}`;

    mockDirectoryContent.push(directoryName);
    mockTrainerFileContentByPath[directoryPath] =
      'This is a directory, not a file!';

    mockFsStatsEntriesByPath[directoryPath] = generateMockFsStatsEntry(true);
  }

  fs.readdirSync.mockReturnValue(mockDirectoryContent);

  fs.readFileSync.mockImplementation((path) => {
    const entry = mockTrainerFileContentByPath[path];

    if (entry.endsWith('-directory')) {
      throw new Error(`'${path}' is not a file!`);
    }

    return entry;
  });

  fs.lstatSync.mockImplementation((name) => {
    return mockFsStatsEntriesByPath[name];
  });

  return chance.shuffle(mockTrainers);
}

function trainerSorter(a, b) {
  return a.name.localeCompare(b.name);
}

describe('Static Content Broker - Unit', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return an array of objects with a specific structure', () => {
    // arrange
    const mockFileSystem = generateMockFileSystem();
    const mockedTrainers = arrangeMockStaticTrainers(mockFileSystem);
    const numTrainers = mockedTrainers.length;

    // act
    const actualTrainers = getAvailableTrainers(mockFileSystem.directory);

    // assert
    expect(actualTrainers.length).toEqual(mockedTrainers.length);

    let trainer;
    for (let i = 0; i < numTrainers; i++) {
      trainer = actualTrainers[i];
      expect(trainer.name).toBeDefined();
    }
  });

  it('should return array of trainers found in specified directory', () => {
    // arrange
    const mockFileSystem = generateMockFileSystem();
    const mockedTrainers = arrangeMockStaticTrainers(mockFileSystem);
    const numTrainers = mockedTrainers.length;

    // act
    const actualTrainers = getAvailableTrainers(mockFileSystem.directory);

    // assert
    expect(actualTrainers).toBeDefined();
    expect(actualTrainers.length).toEqual(numTrainers);

    expect(fs.readdirSync).toHaveBeenCalledTimes(1);
    expect(fs.readdirSync).toHaveBeenCalledWith(mockFileSystem.directory);
    expect(fs.readFileSync).toHaveBeenCalledTimes(numTrainers);

    const pathIndex = 0;
    const optionsIndex = 1;
    let pathParam;
    let optionsParam;
    for (let i = 0; i < numTrainers; i++) {
      pathParam = fs.readFileSync.mock.calls[i][pathIndex];
      expect(pathParam.startsWith(mockFileSystem.directory)).toEqual(true);

      optionsParam = fs.readFileSync.mock.calls[i][optionsIndex];
      expect(optionsParam).toEqual('utf8');
    }

    expect(actualTrainers.sort(trainerSorter))
        .toEqual(mockedTrainers.sort(trainerSorter));
  });

  it('should ignore directories in same directory as trainers', () => {
    // arrange
    const mockFileSystem = generateMockFileSystem();
    const numTrainersToMock = chance.integer({min: 1, max: 5});
    const numDirectoriesToIgnore = chance.integer({min: 1, max: 5});
    const mockedTrainers = arrangeMockStaticTrainers(
        mockFileSystem, numTrainersToMock, numDirectoriesToIgnore);

    // act
    const actualTrainers = getAvailableTrainers(mockFileSystem.directory);

    // assert
    expect(mockedTrainers.length).toEqual(numTrainersToMock);

    expect(actualTrainers).toBeDefined();
    expect(actualTrainers.length).toEqual(numTrainersToMock);
    expect(actualTrainers.sort(trainerSorter))
        .toEqual(mockedTrainers.sort(trainerSorter));
  });
});
