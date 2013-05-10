define('promise',

       [],

function() {

  var types = {
    SUCCESS: 'success',
    FAIL: 'fail'
  };

  function Promise() {
    this.promises = {
      success: [],
      fail: []
    };
  }

  Promise.prototype.chain = function() {
    this.chained = true;
    return this;
  };

  Promise.prototype.then = function(success, fail) {
    if (success) {
      this.promises.success.push(success);
    }
    if (fail) {
      this.promises.fail.push(fail);
    }
    return this;
  };

  Promise.prototype.run = function(type, response) {
    var result = response,
        list = this.promises[type];
    while (list.length) {
      var func = list.shift();
      var callResult = func(result);
      if (this.chained) {
        result = callResult;
      }
    }
    return this;
  };

  Promise.prototype.succeed = function(response) {
    return this.run(types.SUCCESS, response);
  };

  Promise.prototype.fail = function(response) {
    return this.run(types.FAIL, response);
  };

  return Promise;

});