define('net/json',

       ['net/ajax'],

function(ajax) {

  function preprocess(options) {
    options = options || {};
    options.headers = options.headers || {};
    options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
    options.headers['Accept'] = options.headers['Accept'] || 'application/json';
    options.process = process;

    if (options.data) {
      options.data = JSON.stringify(options.data);
    }
  }

  function process(request, promise) {
    var response;
    try {
      response = JSON.parse(request.responseText || {});
    } catch(e) {
      promise.fail(request);
      throw new Error('Error parsing JSON: ' + e);
    }
    return promise.succeed(response);
  }

  function get(options) {
    preprocess(options);
    return ajax.get(options);
  }

  function post(options) {
    preprocess(options);
    return ajax.post(options);
  }

  function put(options) {
    preprocess(options);
    return ajax.put(options);
  }

  function del(options) {
    preprocess(options);
    return ajax.delete(options);
  }

  var api = {
    get: get,
    post: post,
    put: put,
    delete: del
  };

  return api;

});
