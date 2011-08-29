function Scanner(regularExpression) {
  this.regularExpression = regularExpression;
  this.counters = new Array();
  if (arguments.length > 1){
    for (var i = 1; i < arguments.length; i++){
      this.counters.push(arguments[i]);
    }
  }
}

Scanner.prototype.parse = function(string) {
  var that = this;
  var matches = this.regularExpression.exec(string);
  matches && matches.forEach(function(match){
    that.counters.forEach(function(counter){
      counter.callback(match);
    });
  });
};
