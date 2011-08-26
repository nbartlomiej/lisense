beforeEach(function() {
  this.addMatchers({
    toBeArray: function() { return this.actual instanceof Array; },
    toBeRegExp: function() { return this.actual instanceof RegExp; }
  });
});
