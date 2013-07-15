#!/usr/bin/env node

require('proof')(4, function (step, deepEqual, ok) {
    var parser = require('../../register').argParser
    deepEqual(parser('./script.cgi.js', [ 'http://alan:password@www.foo.com:8080/hello?a=b#c' ]).url, {
        protocol: 'http:',
        slashes: true,
        auth: 'alan:password',
        host: 'www.foo.com:8080',
        port: '8080',
        hostname: 'www.foo.com',
        hash: '#c',
        search: '?a=b',
        query: { a: 'b' },
        pathname: '/hello',
        path: '/hello?a=b',
        href: 'http://alan:password@www.foo.com:8080/hello?a=b#c'
    }, 'full url')
    deepEqual(parser('./script.cgi.js', [ ' /hello?a=b#c' ]).url, {
        protocol: null,
        slashes: null,
        auth: null,
        host: null,
        port: null,
        hostname: null,
        hash: '#c',
        search: '?a=b',
        query: { a: 'b' },
        pathname: '/hello',
        path: '/hello?a=b',
        href: '/hello?a=b#c'
    }, 'path url')
    deepEqual(parser('./script.cgi.js', [ ' /hello?a=b#c', 'd=e f' ]).url, {
        protocol: null,
        slashes: null,
        auth: null,
        host: null,
        port: null,
        hostname: null,
        hash: '#c',
        search: '?a=b&d=e%20f',
        query: { a: 'b', d: 'e f' },
        pathname: '/hello',
        path: '/hello?a=b&d=e%20f',
        href: '/hello?a=b&d=e%20f#c'
    }, 'path and parameters')
    deepEqual(parser('./script.cgi.js', [ 'a=b', 'd=e f' ]).url, {
        protocol: null,
        slashes: null,
        auth: null,
        host: null,
        port: null,
        hostname: null,
        hash: null,
        search: '?a=b&d=e%20f',
        query: { a: 'b', d: 'e f' },
        pathname: './script.cgi.js',
        path: './script.cgi.js?a=b&d=e%20f',
        href: './script.cgi.js?a=b&d=e%20f'
  }, 'script and parameters')
})
