// TODO: refactor, make initializeResult return a variable and not modify
// object variable
function Counter(scanner, initializeResult){
  if (initializeResult){
    this.initializeResult = initializeResult;
  } else {
    this.initializeResult = function(){ this.result = 0; }
  }
  this.initializeResult();
  this.initializeCounter();
  this.scanner = scanner;
  scanner.counters.push(this);
};
Counter.prototype.initializeCounter = function(){
  this.notifiers = new Array();
};
Counter.prototype.callback = function(){
  this.result++;
};
Counter.prototype.callNotifiers = function(){
  var that = this;
  this.notifiers.forEach(function(notifier){
    notifier.callback(that, that.result);
  });
  this.initializeResult();
};

function LongestOccurrenceCounter(scanner, resultsLength){
  if(resultsLength==undefined){
    this.resultsLength = 1;
  } else {
    this.resultsLength = resultsLength;
  }
  this.prototype = new Counter(scanner);
  Counter.prototype.initializeCounter.apply(this);
  this.results = new Array();
};

LongestOccurrenceCounter.prototype.callback = function(match){
  if (this.results.length < this.resultsLength){
    this.results.push(match);
  } else if (this.results[this.results.length-1].length < match.length) {
    this.results.push(match);
    this.results.sort(function(a,b){
      return b.length - a.length;
    });
    this.results.length = this.resultsLength;
  }
};
