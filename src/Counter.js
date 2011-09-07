function Counter(scanner){
  this.result = 0;
  this.name = 'counter';
  this.notifiers = new Array();
  this.scanner = scanner;
  scanner.counters.push(this);
};
Counter.prototype.callback = function(){
  this.result++;
};
Counter.prototype.callNotifiers = function(){
  var that = this;
  this.notifiers.forEach(function(notifier){
    notifier.callback(that, that.result);
  });
};

function MatchLettersCounter(){
  this.result = new Array();
}
MatchLettersCounter.prototype.callback = function(match){
  this.result.push(match.length);
};
