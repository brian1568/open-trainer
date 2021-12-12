describe('Local Machine Environment', () => {
  it('should use correct Node.js version', () => {
    // arrange
    const expectedVersion = 'v16.13.0';

    // act
    const detectedVersion = process.version;

    // assert
    expect(detectedVersion).toEqual(expectedVersion);
  });
});
