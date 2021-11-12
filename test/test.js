

var expect = require("chai").expect;
var server = require("../server");
var client = require("../client");
var assert = require('assert');



describe('IP address checker', function() {
    it ('Checks to see if the ip address of the client is over the rate limit', function() {
        var testOne = server.isUnderLimit("1");
        var testTwo = server.isUnderLimit("1");
        var testThree = server.isUnderLimit("1");
        var testFour = server.isUnderLimit("1");

        expect(testOne).to.equal(true);
        expect(testTwo).to.equal(true);
        expect(testThree).to.equal(true);
        expect(testFour).to.equal(false);
    });
});

describe('getServer', function(){
    it('initializes the server', function() {
        
    });
});

describe('getPackage', function(){
    it('handles a getPackage request. When given an empty object, returns the package', function() {

    });
});

describe('server initialization', function(){
    it('binds the server to a port, processes the dbpath, and starts the server', function() {

    });
});


describe('runGetPackage', function(){
    it('creates the empty object to pass to the getPackage, and handles the result', function() {

    });
});


