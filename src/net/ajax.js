define('net/ajax',

       [],

function() {

  window.XMLHttpRequest = window.XMLHttpRequest || (function () {
    var types = ['Msxml2.XMLHTTP.6.0',
                 'Msxml2.XMLHTTP.3.0',
                 'Microsoft.XMLHTTP'];
    for (var i = 0; i < types.length; i++) {
      try {
        new ActiveXObject(types[i]);
        return function() {
          return new ActiveXObject(types[i]);
        };
      } catch (e) { }
    }
    throw new Error('This browser does not support XMLHttpRequest.');
  }());

  var METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
  };

  var validResponses = {
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    204: 'No Content'
  };

  var invalidResponses = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    411: 'Method Not Allowed',
    500: 'Internal Server Error',
    501: 'Unsupported Method'
  };

  function nothing() { };

  function request(options) {

    var success = options.success || nothing;
    var error = options.error || nothing;
    var req = new XMLHttpRequest();

    req.open(options.method, options.url, true);

    options.headers = options.headers || {};

    for (var k in options.headers) {
      req.setRequestHeader(k, options.headers[k]);
    }

    req.onreadystatechange = function() {
      if (req.readyState !== 4) {
        return;
      }

      if ((req.status in invalidResponses) &&
          !(req.status in validResponses)) {
        error(req);
        throw new Error('Error issuing ' + options.method + ' to ' +
                        options.url + ' (' + req.status + ' ' +
                        invalidResponses[req.status] + ')');
      }

      if (options.process) {
        options.process.call(options.process, req, success, error);
      } else {
        success(req);
      }

    };

    if (req.readyState === 4) {
      return;
    }

    req.send(options.data || null);
  }

  function get(options) {
    options.method = METHODS.GET;
    request(options);
  }

  function post(options) {
    options.method = METHODS.POST;
    request(options);
  }

  function put(options) {
    options.method = METHODS.PUT;
    request(options);
  }

  function del(options) {
    options.method = METHODS.DELETE;
    request(options);
  }

  var api = {
    get: get,
    post: post,
    put: put,
    delete: del,
    request: request
  };

  return api;

});
