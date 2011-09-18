beforeEach(function() {
  this.addMatchers({
    toBeEmptyObject: function() {
      if (this.actual == undefined) return false;
      // implementation taken from jQuery's method of the same name
      for ( var name in this.actual ) {
        return false;
      }
      return true;
    },
    toBeArray: function() { return this.actual instanceof Array; },
    toBeEmptyArray: function() {
      return (this.actual instanceof Array) && (this.actual.length == 0);
    },
    toBeRegExp: function() { return this.actual instanceof RegExp; }
  });
});
