define('net',

       ['net/ajax',
        'net/json',
        'net/form'],

function(ajax, json, form) {

  var api = {
    ajax: ajax,
    json: json,
    form: form
  };

  return api;

});
