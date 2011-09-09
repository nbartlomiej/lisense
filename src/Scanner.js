function Scanner(scannerGroup, regularExpression) {
  scannerGroup.scanners.push(this);
  this.regularExpression = regularExpression;
  this.counters = new Array();
}

Scanner.prototype.parse = function(string) {
  var that = this;
  var matches = string.match(this.regularExpression);
  matches && matches.forEach(function(match){
    that.counters.forEach(function(counter){
      counter.callback(match);
    });
  });
  this.counters.forEach(function(counter){
    counter.callNotifiers();
  });
};
