define('net/ajax',

       ['promise'],

function(Promise) {

  window.XMLHttpRequest = window.XMLHttpRequest || (function() {

    var types = ['Msxml2.XMLHTTP.6.0',
                 'Msxml2.XMLHTTP.3.0',
                 'Microsoft.XMLHTTP'];

	  var manufacture = function(type) {
		  return function() {
			  return new window.ActiveXObject(type);
		  };
	  };

    for (var i = 0; i < types.length; i++) {
      try {
	      var n = new window.ActiveXObject(types[i]);
	      return manufacture(types[i]);
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

	function nothing() { }

	function handleReadyStateChange(promise, options) {
		
		return function() {
			if (this.readyState !== 4) {
				return;
			}
			if ((this.status in invalidResponses) &&
			    !(this.status in validResponses)) {
				promise.fail(this);
			} else {
				if (options.process) {
					options.process.call(options.process, this, promise);
				} else {
					promise.succeed(this);
				}
			}
		};

	}

  function request(optionsOrString, options) {

	  options = options || {};

	  if (typeof optionsOrString === 'string') {
		  options.url = optionsOrString;
	  } else {
		  options = optionsOrString;
	  }

    var promise = new Promise();
	  promise.then(options.success || nothing,
	               options.error || nothing);

    var req = new XMLHttpRequest();
    req.open(options.method || METHODS.GET, options.url, true);

    options.headers = options.headers || {};

    for (var k in options.headers) {
      req.setRequestHeader(k, options.headers[k]);
    }

    req.withCredentials = options.withCredentials;

    req.onreadystatechange = handleReadyStateChange(promise, options);

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
