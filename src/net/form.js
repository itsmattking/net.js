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

  function formDataize(data) {
      var fd = new FormData();
      for ( var k in data ) {
          fd.append(k, data[k]);
      }
      return fd;
  }

  function preprocess(options) {
    options = options || {};
    options.headers = options.headers || {};
    if (!options.useFormData) { options.headers['Content-Type'] = 'application/x-www-form-urlencoded'; }
    if (options.data) {
      if ( options.useFormData ) {
        options.data = formDataize(options.data);
      } else {
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
