function Matcher(regularExpression) {
  this.regularExpression = regularExpression;
  this.counters = new Array();
}

Matcher.prototype.parse = function(string) {
  var that = this;
  var matches = this.regularExpression.exec(string);
  matches && matches.forEach(function(match){
    that.counters.forEach(function(counter){
      counter.callback(match);
    });
  });
};
