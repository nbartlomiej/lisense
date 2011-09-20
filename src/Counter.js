// TODO: refactor, make initializeResult return a variable and not modify
// object variable
function Counter(scanner, initializeResult){
  if (initializeResult){
    this.initializeResult = initializeResult;
  } else {
    this.initializeResult = function(){ this.result = 0; }
  }
  this.initializeResult();
  this.notifiers = new Array();
  if (scanner){
    this.scanner = scanner;
    scanner.counters.push(this);
  }
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


function LongestOccurrenceCounter(scanner, maximumResultLength){
  Counter.call(this, scanner, function(){this.result = new Array()});
  if(maximumResultLength==undefined){
    this.maximumResultLength = 1;
  } else {
    this.maximumResultLength = maximumResultLength;
  }
};

LongestOccurrenceCounter.prototype = new Counter();

LongestOccurrenceCounter.prototype.callback = function(match){
  if (this.result.length < this.maximumResultLength){
    this.result.push(match);
  } else if (this.result[this.result.length-1].length < match.length) {
    this.result.push(match);
    this.result.sort(function(a,b){
      return b.length - a.length;
    });
    this.result.length = this.maximumResultLength;
  }
};
