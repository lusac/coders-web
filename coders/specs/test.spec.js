describe('Simple object', function() {

    beforeEach(function() {
        response = myTest();
    });

    it('should work', function() {
        expect(response).toEqual('Test working');
    });
});