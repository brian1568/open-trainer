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
  const filesystem = {
    directory: `some-directory-${chance.word()}`,
    fileContentByPath: {},
    directoryContent: [],
    statsEntriesByPath: {},
  };

  return {
    fs: filesystem,
  };
}

// Generate random purely mocked trainer files in specified directory
// When numDirectories > 0, will mix in that many directories
function arrangeMockStaticTrainers(
    mfs = generateMockFileSystem(),
    numTrainers = chance.integer({min: 1, max: 20}),
    numDirectories = 0) {
  const mockTrainers = [];
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
    const trainerPath = `${mfs.fs.directory}/${trainerFilename}`;

    mfs.fs.directoryContent.push(trainerFilename);
    fileContent = generateMockTrainerFileContent(trainerName);
    mfs.fs.fileContentByPath[trainerPath] = fileContent;
    mockTrainers.push(JSON.parse(fileContent));

    mfs.fs.statsEntriesByPath[trainerPath] =
      generateMockFsStatsEntry(false);
  }

  const uniqueTrainerDirectoryNames = chance.unique(() => {
    return `${chance.word()}-directory`;
  }, numTrainers);

  for (let j = 0; j < numDirectories; j++) {
    const directoryName = uniqueTrainerDirectoryNames[j];
    const directoryPath = `${mfs.fs.directory}/${directoryName}`;

    mfs.fs.directoryContent.push(directoryName);
    mfs.fs.fileContentByPath[directoryPath] =
      'This is a directory, not a file!';

    mfs.fs.statsEntriesByPath[directoryPath] =
      generateMockFsStatsEntry(true);
  }

  fs.readdirSync.mockReturnValue(mfs.fs.directoryContent);

  fs.readFileSync.mockImplementation((path) => {
    const entry = mfs.fs.fileContentByPath[path];

    if (entry.endsWith('-directory')) {
      throw new Error(`'${path}' is not a file!`);
    }

    return entry;
  });

  fs.lstatSync.mockImplementation((name) => {
    return mfs.fs.statsEntriesByPath[name];
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
    const mfs = generateMockFileSystem();
    const mockedTrainers = arrangeMockStaticTrainers(mfs);
    const numTrainers = mockedTrainers.length;

    // act
    const actualTrainers = getAvailableTrainers(mfs.fs.directory);

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
    const mfs = generateMockFileSystem();
    const mockedTrainers = arrangeMockStaticTrainers(mfs);
    const numTrainers = mockedTrainers.length;

    // act
    const actualTrainers = getAvailableTrainers(mfs.fs.directory);

    // assert
    expect(actualTrainers).toBeDefined();
    expect(actualTrainers.length).toEqual(numTrainers);

    expect(fs.readdirSync).toHaveBeenCalledTimes(1);
    expect(fs.readdirSync).toHaveBeenCalledWith(mfs.fs.directory);
    expect(fs.readFileSync).toHaveBeenCalledTimes(numTrainers);

    const pathIndex = 0;
    const optionsIndex = 1;
    let pathParam;
    let optionsParam;
    for (let i = 0; i < numTrainers; i++) {
      pathParam = fs.readFileSync.mock.calls[i][pathIndex];
      expect(pathParam.startsWith(mfs.fs.directory)).toEqual(true);

      optionsParam = fs.readFileSync.mock.calls[i][optionsIndex];
      expect(optionsParam).toEqual('utf8');
    }

    expect(actualTrainers.sort(trainerSorter))
        .toEqual(mockedTrainers.sort(trainerSorter));
  });

  it('should ignore directories in same directory as trainers', () => {
    // arrange
    const mfs = generateMockFileSystem();
    const numTrainersToMock = chance.integer({min: 1, max: 5});
    const numDirectoriesToIgnore = chance.integer({min: 1, max: 5});
    const mockedTrainers = arrangeMockStaticTrainers(
        mfs, numTrainersToMock, numDirectoriesToIgnore);

    // act
    const actualTrainers = getAvailableTrainers(mfs.fs.directory);

    // assert
    expect(mockedTrainers.length).toEqual(numTrainersToMock);

    expect(actualTrainers).toBeDefined();
    expect(actualTrainers.length).toEqual(numTrainersToMock);
    expect(actualTrainers.sort(trainerSorter))
        .toEqual(mockedTrainers.sort(trainerSorter));
  });
});
