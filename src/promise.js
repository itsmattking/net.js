define('promise',

       [],

function() {

  function Promise() {
    this.promises = {
      success: [],
      fail: []
    };
    this.filters = [];
  }

  Promise.prototype.chain = function() {
    this.chained = true;
    return this;
  };

  Promise.prototype.filter = function(func) {
    this.filters.push(func);
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
    for (var i = 0; i < this.filters.length; i++) {
      result = this.filters[i](result) || result;
    }
    while (this.promises.success.length) {
      var func = this.promises.success.shift();
      var callResult = func(result);
      if (this.chained) {
        result = callResult;
      }
    }
    return this;
  };

  Promise.prototype.fail = function(response) {
    var result = response;
    for (var i = 0; i < this.filters.length; i++) {
      result = this.filters[i](result) || result;
    }
    while (this.promises.fail.length) {
      var func = this.promises.fail.shift();
      var callResult = func(result);
      if (this.chained) {
        result = callResult;
      }
    }
    return this;
  };

  return Promise;

});