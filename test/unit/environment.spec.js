describe('Local Machine Environment', () => {

   it('should use correct nodejs version', () => {
       // arrange
       const expectedNodeJsVersion = 'v16.13.0'

       // act
       const detectedNodeJsVersion = process.version;

       // assert
       expect(detectedNodeJsVersion).toEqual(expectedNodeJsVersion);
   });

});
