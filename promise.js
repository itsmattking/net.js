define('promise',

       [],

function() {

  function Promise() {
    this.promises = {
      success: [],
      failure: []
    };
  }

  Promise.prototype.chain = function() {
    this.chain = true;
  };

  Promise.prototype.then = function(success, failure) {
    if (success) {
      this.promises.success.push(success);
    }
    if (failure) {
      this.promises.failure.push(failure);
    }
  };

  Promise.prototype.succeed = function(response) {
    var result = response;
    for (var i = 0; i < this.promises.success.length; i++) {
      var callResult = this.promises.success[i](result);
      if (this.chain) {
        result = callResult;
      }
    }
  };

  Promise.prototype.fail = function(response) {
    var result = response;
    for (var i = 0; i < this.promises.length; i++) {
      var callResult = this.promises.failure[i](result);
      if (this.chain) {
        result = callResult;
      }
    }
  };

  return Promise;

});