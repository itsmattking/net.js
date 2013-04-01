define('promise',

       [],

function() {

  function Promise() {
    this.promises = {
      success: [],
      fail: []
    };
  }

  Promise.prototype.chain = function() {
    this.chain = true;
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

  Promise.prototype.succeed = function(response) {
    var result = response;
    while (this.promises.success.length) {
      var func = this.promises.success.shift();
      var callResult = func(result);
      if (this.chain) {
        result = callResult;
      }
    }
    return this;
  };

  Promise.prototype.fail = function(response) {
    var result = response;
    while (this.promises.fail.length) {
      var func = this.promises.fail.shift();
      var callResult = func(result);
      if (this.chain) {
        result = callResult;
      }
    }
    return this;
  };

  return Promise;

});