'use strict';

var Q = require('q'),
    dns = require('dns'),
    resolveMx = Q.nfbind(dns.resolveMx),
    GMAIL_SERVER_SQNC = 'ASPMX.L.GOOGLE.com';

/**
 * Evaluates whether or not an email address resides on Gmail server.
 *
 * @param domain
 * @param tld
 * @return {*}
 */
function isGmailServer(domain, tld) {
    if (domain === 'gmail' || domain == 'googlemail') {
        var deferred = Q.defer();
        deferred.resolve('gmail.com');
        return deferred.promise;
    }

    var server = domain + '.' + tld;
    return resolveMx(server)
        .then(function(addresses) {
            for (var index in addresses) {
                if (addresses[index].exchange.indexOf(GMAIL_SERVER_SQNC) !== -1) {
                    return server;
                }
            }
            return new Error('Server ' + server + ' is not a Gmail server');
        });
}

/**
 * Removes periods and any text after a plus sign.
 *
 * @param user the user to be canonicalized
 * @return {string}
 */
function normalizeUser(user) {
    return user.split('+')[0].replace(/\./g, "");
}

/**
 * Helps to check a given email address for uniqueness.
 *
 * Normalizes any email address on a Gmail server, including Google Apps
 * addresses with custom domains, to its simplest canonical representation so
 * that it can be compared against other canonical email addresses.
 *
 * The canonical address should not be stored in stead of the user's inputed
 * address, as some folks use these modifications to route their incoming
 * email to particular folders.
 *
 * @param email the email address to be canonicalized
 * @retursn {string}
 */
function normalize(email) {
    if (!email.toLowerCase || email.indexOf('@') === -1) {
        return null;
    }
    email = email.toLowerCase();

    var chunks = email.split('@'),
        server = chunks.pop(),
        user = chunks.pop();

    chunks = server.split('.');
    var tld = chunks.pop(),
        domain = chunks.join('.');

    return isGmailServer(domain, tld)
        .then(function(server) {
            return normalizeUser(user) + '@' + server;
        })
        .fail(function(err) {
            return email;
        });
}

module.exports = {
    normalize: normalize
};
