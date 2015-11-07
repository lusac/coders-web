describe('Simple object', function() {
    beforeEach(function() {
        jasmine.getFixtures().fixturesPath = 'coders/specs/';
        loadFixtures('custom.html');
        response = myTest();
    });

    it('should work', function() {
        expect(response).toEqual('Test working');
    });
});