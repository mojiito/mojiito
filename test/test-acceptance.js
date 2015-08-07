describe('Acceptance: ', function() {
    var jQuery;
    var Mojito;
    beforeEach('some description', function() {
        jQuery = require('../bower_components/jquery/dist/jquery.js');
        Mojito = require('../lib/core.js');
    });
    it('mojito can be required and is available', function() {
        jQuery.should.be.a('function');
    });
    it('mojito can be required and created', function() {
        Mojito.should.be.a('function');
    });
});
