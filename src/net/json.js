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

  function process(response, success, error) {
    try {
      response = JSON.parse(response || {});
    } catch(e) {
      error(response);
      throw new Error('Error parsing JSON: ' + e);
    }
    success(response);
  }

  function get(options) {
    preprocess(options);
    ajax.get(options);
  }

  function post(options) {
    preprocess(options);
    ajax.post(options);
  }

  function put(options) {
    preprocess(options);
    ajax.put(options);
  }

  function del(options) {
    preprocess(options);
    ajax.del(options);
  }

  var api = {
    get: get,
    post: post,
    put: put,
    delete: del
  };

  return api;

});