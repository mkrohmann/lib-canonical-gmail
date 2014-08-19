'use strict';

var normalizer = require('../index.js'),
    chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('The normalizer', function() {
    it('should transform the email address to lowercase', function() {
        var testAddress = 'LarryPage@Gmail.com';
        return normalizer.normalize(testAddress)
            .then(function(normalized) {
                expect(normalized).to.equal('larrypage@gmail.com');
            });
    });

    it('should replace any Gmail address that is not gmail.com by gmail.com', function() {
        var testAddress = 'larrypage@googlemail.com';
        return normalizer.normalize(testAddress)
            .then(function(normalized) {
                expect(normalized).to.equal('larrypage@gmail.com');
            });       var normalized = normalizer.normalize(testAddress);
    });

    it('should remove periods from the user name', function() {
        var testAddress = 'larry.page@gmail.com';
        return normalizer.normalize(testAddress)
            .then(function(normalized) {
                expect(normalized).to.equal('larrypage@gmail.com');
            });
    });

    it('should remove any text after plus sign from the user name', function() {
        var testAddress = 'larrypage+google@gmail.com';
        return normalizer.normalize(testAddress)
            .then(function(normalized) {
                expect(normalized).to.equal('larrypage@gmail.com');
            });
    });

    it('should normalize google apps addresses with custom domains', function() {
        var testAddress = 'larrypage+rezhound@rezhound.com';
        return normalizer.normalize(testAddress)
            .then(function(normalized) {
                expect(normalized).to.equal('larrypage@rezhound.com');
            });
    });
});
