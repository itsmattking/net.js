define('net/form',

       ['net/ajax'],

function(ajax) {

  function serialize(data) {
    for (var index = 0, keys = Object.keys(data), length = keys.length, out = [];
         index < length;
         index++) {

      out.push([
        encodeURIComponent(keys[index]),
        encodeURIComponent(data[keys[index]])
      ].join('='));
    }
    return out.join('&');
  }

  function preprocess(options) {
    options = options || {};
    options.headers = options.headers || {};
    if (options.data) {
      if (options.data.nodeName === 'FORM') {
        options.data = new FormData(options.data);
      } else if (!(options.data instanceof FormData)) {
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        options.data = serialize(options.data);
      }
    }
  }

  function post(options) {
    preprocess(options);
    return ajax.post(options);
  }

  function put(options) {
    preprocess(options);
    return ajax.put(options);
  }

  var api = {
    post: post,
    put: put
  };

  return api;

});
