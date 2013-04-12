# Register [![Build Status](https://secure.travis-ci.org/bigeasy/register.png?branch=master)](http://travis-ci.org/bigeasy/register) [![Coverage Status](https://coveralls.io/repos/bigeasy/register/badge.png?branch=master)](https://coveralls.io/r/bigeasy/register) [![NPM version](https://badge.fury.io/js/register.png)](http://badge.fury.io/js/register)

A CGI-like router for building HTTP APIs that serves JavaScript programs from a
directory.

```
 119  501 3467 README.md
```

## Getting Started



### Install

Get Register with NPM.

```
install npm register
```

### Minimal Register Script

Create a register script, give it a name like `params.cgi.js`.

```
require('register')(function (request, response) {
  response.setHeader('Content-Type', 'text/plain');
  response.end(JSON.stringify(request.url.query || {}) + '\n');
});
```

### Running a Register Script at the Command Line

You can now run you script from the command line to debug it. You can run it
directly or run it through a debugger.

```
$ node params.cgi.js 'name=register&number=1'
Content-Type: text/plain

{"name":"register","number":1}
```

### Testing Register Scripts with Mock Requests

Testing your register scripts is simplified by a mock request wrapper. Here we
create at test that is a simple Node.js program, but you can use the mock
request wrapper in the test framework of your choice.

```
var deepEqual = require ('assert').deepEqual;
var request = require('register/request');

request('./hello.cgi.js', { name: 'register', number: 1 }, function (headers, body) {
  deepEqual(headers['Content-Type'], 'text/plain');
  deepEqual(JSON.parse(body), { name: 'register', number: 1 });
});

```

### Serving Up Your Register Scripts

Register works with Sencha Connect to add Register scripts to your web service.
We can create a service using a directory and add it to a Sencha Connect app.

```javascript
var service = require('regsiter/service');
var connect = require('connect');

var app = connect()
      .use(service.create('./scripts'))
      .listen(8082);
```

## Routing

Register uses the directory driven [Reactor](https://github.com/bigeasy/reactor)
router to generate the routes for your web application. It follows some
conventions that convert the path of a script in a directory tree to the url
path in your application.

Let's use this example directory.

```
./
  ./params.cgi.js
  ./index.cgi.js
  ./utility.js
  ./configuration.txt
  ./articles/index.cgi.js
  ./articles/edit_.cgi.js
```

### Routing File Suffix

Only the files ending with `.cgi.js` are considered for addition to the path by
the service. The file basename is used for the file path so that `params.cgi.js`
in the directory is requested by the url `http://localhost/params`.

### Index Files

If the file base name is `index` as in `index.cgi.js`, then that is the script
that is run when url matches the directory name. `index.cgi.js` is run for the
root url `http://localhost/`.

### Path Slurping Files

If the file base name ends with an underscore, the script will match a url path.
The `` ./articles/edit_.cgi.js `` will match `http://localhost/articles/edit`.
Additionally, it will also match any sub-paths, so it would also match

 * `http://localhost/edit/1`
 * `http://localhost/edit/how-to-use-register`
 * `http://localhost/edit/2005/02/14`

The path would be passed into script as a `pathInfo` property of the `request`
object.

This is all inspired by the good old days of creating web sites by letting them
sprawl out over a directory on your web server. If you want to change the URL
paths of your program, simply rename your files and move them into a different
directory. There's no need to update your routing DSL. What you see is what you
get.

## Writing Scripts

A Regsiter script is a JavaScript program that wraps a JavaScript function. It
is a simple construct that maps a URL to a single function through a directory
tree. The function acts as a run-of-the-mill request handler function for a
server created with the Node.js HTTP API. It inspects the `request` object and
sends response through the `response`object .

With Register we create our request handlers in files that we can copy between
applications &mdash; gasp! &mdash; like in the good old days script archives. We
can reorganize the routing of our application by reorganizing our scripts. When
we look at our scripts in a tree view of the directory, we're seeing

### Respond to a Request

We respond to a request by writing a response using the `response` object. The
`request` object contains details about the request, like the URL, query
parameters, and request headers. The `response` object contains methods for
writing a message the browser can see.

You know this already if you've done any web programming with Node.js, these are
the `request` and `response` objects created by the Node.js HTTP server.

### Getting a Parsed URL

The `request` object has a URL property, but it is just a string. To do anything
meaningful with that URL, we need to parse it &mdash; we need to split it up
into it's component parts.

Regsiter will save us a step and give us a parsed `url` if we request it. We
request a parsed url simply by adding the parameter `url` to our handler
function.

### Handling Parameters

With our parsed URL we can inspect parameters using the `query` property of the
parsed url.

### Handling Path Information

## Errors and Redirects

To send errors we use the `control` object, or do we?

Must be sent before body is sent.

### Sending Errors

### Sending Redirects

### Rerouting

## Asynchronous Control Flow

With Cadence.

## Change Log

Changes for each release.

### Version 0.0.0

Mon Mar 25 18:44:29 UTC 2013

 * Serve a basic script from the file system though HTTP. #8. #7. #6. #5.
 * Run a script as a program. #4.
