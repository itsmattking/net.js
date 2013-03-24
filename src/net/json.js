define('net/json',

       ['net/ajax'],

function(ajax) {

  var CONTENT_TYPE = 'application/json';

  function preprocess(options) {
    options = options || {};
    options.headers = options.headers || {};
    options.headers['Content-Type'] = options.headers['Content-Type'] || CONTENT_TYPE;
    options.headers['Accept'] = options.headers['Accept'] || CONTENT_TYPE;
    options.process = process;
  }

  function process(response, success, error) {
    try {
      response = JSON.parse(response || {});
    } catch(e) {
      error(null);
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
    options.data = JSON.stringify(options.data || {});
    ajax.post(options);
  }

  function put(options) {
    preprocess(options);
    options.data = JSON.stringify(options.data || {});
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