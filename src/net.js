define('net',

       ['net/ajax',
        'net/json'],

function(ajax, json) {

  var api = {
    ajax: ajax,
    json: json
  };

  return api;

});