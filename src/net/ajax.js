define('net/ajax',

       ['promise'],

function(Promise) {

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

  var reqType;

  function nothing() { };

  function request(options) {

    if(typeof reqType === 'undefined') {
        reqType = window.XMLHttpRequest = window.XMLHttpRequest || (function () {
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
    }

    var success = options.success;
    var error = options.error;

    var promise = new Promise();
    if (success || error) {
      promise.then(success || nothing,
                   error || nothing);
    }

    var req = new reqType();
    req.open(options.method, options.url, true);

    options.headers = options.headers || {};

    for (var k in options.headers) {
      req.setRequestHeader(k, options.headers[k]);
    }

    req.withCredentials = options.withCredentials;

    req.onreadystatechange = function() {
      if (req.readyState !== 4) {
        return;
      }

      if ( ((req.status in invalidResponses) && !(req.status in validResponses)) || req.status === 0 ) {

        if ( req.status === 0 ) { // no response from server
            req.response = {};
            req.response.error = 'The server could not be reached';
        }

        if ( options.process ) {
            options.process.call(options.process, req, promise, 'fail');
        } else {
            promise.fail(req);
        }

        /*throw new Error('Error issuing ' + options.method + ' to ' +
                        options.url + ' (' + req.status + ' ' +
                        invalidResponses[req.status] + ')');*/
        return;
      }

      if (options.process) {
        options.process.call(options.process, req, promise, 'succeed');
      } else {
        promise.succeed(req);
      }

    };

    if (req.readyState === 4) {
      return false;
    }

    req.send(options.data || null);

    return promise;
  }

  function get(options) {
    options.method = METHODS.GET;
    return request(options);
  }

  function post(options) {
    options.method = METHODS.POST;
    return request(options);
  }

  function put(options) {
    options.method = METHODS.PUT;
    return request(options);
  }

  function del(options) {
    options.method = METHODS.DELETE;
    return request(options);
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
