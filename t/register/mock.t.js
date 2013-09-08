#!/usr/bin/env node

var request = require('../../request')

require('proof')(4, function (step, deepEqual, say) {
    step(function () {
        request(__dirname + '/fixtures//hello', [], null, step())
    }, function (response) {
        deepEqual(response.headers['content-type'], 'text/plain', 'hello header')
        deepEqual(response.body, 'Hello, World!\n', 'hello body')
    }, function () {
        request(__dirname + '/fixtures//query', [ 'a=1' ], null, step())
    }, function (response) {
        deepEqual(response.headers['content-type'], 'text/plain', 'param header')
        deepEqual(JSON.parse(response.body), { a: 1 }, 'param body')
    })
})
