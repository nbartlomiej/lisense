function Scanner(regularExpression, name) {
  this.regularExpression = regularExpression;
  this.counters = new Array();
  this.name = name;
  if (arguments.length > 2){
    for (var i = 2; i < arguments.length; i++){
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
