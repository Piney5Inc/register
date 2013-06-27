var stream = require('stream'),
    ok = require('assert'),
    connect = require('connect'),
    cadence = require('cadence'),
    __slice = [].slice;

/*
function die () {
  console.log.apply(console, __slice.call(arguments, 0));
  process.exit(1);
}

function say () { console.log.apply(console, __slice.call(arguments, 0)) }
*/

function parameterize (program, context) {
  var $ = /^function\s*[^(]*\(([^)]*)\)/.exec(program.toString());
  ok($, "bad function");
  return $[1].trim().split(/\s*,\s*/).map(function (parameter) {
    return context[parameter];
  });
}

var middleware = [ connect.bodyParser(), connect.query() ];

function pipeline (methods, request, response, callback) {
  if (methods.length) {
    var method = methods.shift();
    method(request, response, function (error) {
      if (error) callback(error);
      else pipeline(methods, request, response, callback);
    });
  } else {
    callback(null, request, response);
  }
}

function execute () {
  var vargs = __slice.call(arguments),
      caller = vargs.shift(), program = vargs.shift();

  var script = cadence(function (step, options) {
    var context = { headers: {}, step: step };
    if (options.request) {
      context.request = options.request;
    } else if (!context.request) {
      context.request = {};
    }
    if (!context.request.headers) {
      context.request.headers = {};
    }
    if (options.response) {
      context.response = options.response;
    } else {
      var headers = {}, headersSent = ! options.printHeaders, sendHeaders,
          output = options.output || new stream.PassThrough;
      if (require.main === caller) {
        sendHeaders = function () {
          var keys = Object.keys(headers);
          keys.forEach(function (key) {
            headers[key].forEach(function (value) {
              output.write(key + ': ' + value + '\n');
            });
          });
          if (keys.length) {
            output.write('\n');
          }
        }
      } else {
        sendHeaders = function () {}
      }

      context.step = step;
      context.response = {
        setHeader: function (header, value) {
          headers[header] = Array.isArray(value) ? value : [value];
        },
        write: function () {
          if (!headersSent) sendHeaders();
          headersSent = true;
          output.write.apply(output, arguments)
        },
        end: function () {
          if (!headersSent) sendHeaders();
          headersSent = true;
          output.end.apply(output, arguments)
        }
      }
    }

    step(function () {
      pipeline(middleware.slice(), context.request, context.response, step());
    }, function () {
      context.request.params = context.request.query;
      program.apply(this, parameterize(program, context));
    }, function () {
      step(null, headers, output);
    });
  });

  if (caller === require.main) {
    var output = new stream.PassThrough(), url = require('url'), query = {};
    process.argv.slice(2).forEach(function (pair) {
      var $ = /^([^=])*(?:=(.*))$/.exec(pair);
      query[$[1]] = $[2];
    });
    var request = {};
    request.url = url.format({ pathname: caller.filename, query: query });
    output.pipe(process.stdout);
    script({ request: request, output: output, printHeaders: true }, function (error) {
      if (error) throw error;
    });
  } else {
    caller.exports = script;
  }
}

module.exports = execute;
