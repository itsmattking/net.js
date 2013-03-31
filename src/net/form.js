define('net/form',

       ['net/ajax'],

function(ajax) {

  function serialize(data) {
    var out = [];
    for (var k in data) {
      out.push([
        encodeURIComponent(k),
        encodeURIComponent(data[k])
      ].join('='));
    }
    return out.join('&');
  }

  function preprocess(options) {
    options = options || {};
    options.headers = options.headers || {};
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    if (options.data) {
      options.data = serialize(options.data);
    }
  }

  function post(options) {
    preprocess(options);
    ajax.post(options);
  }

  function put(options) {
    preprocess(options);
    ajax.put(options);
  }

  var api = {
    post: post,
    put: put
  };

  return api;

});