function Counter(scanner, initialResultFactory){
  if (initialResultFactory){
    this.initialResultFactory = initialResultFactory;
  } else {
    this.initialResultFactory = function(){ return 0; };
  }
  this.result = this.initialResultFactory();
  this.notifiers = new Array();
  this.ignorePatterns = new Array();
  if (scanner){
    this.scanner = scanner;
    scanner.counters.push(this);
  }
};
Counter.prototype.callback = function(string){
  if (this.ignorePatterns.some(function(pattern){ return string.match(pattern);})){
    // There exists a pattern that matches our string, therefore we're ignoring
    // this string.
  } else {
    this.processMatch(string);
  }
};
Counter.prototype.processMatch = function(match){
  this.result++;
};
Counter.prototype.callNotifiers = function(){
  var that = this;
  this.notifiers.forEach(function(notifier){
    notifier.callback(that, that.result);
  });
  this.result = this.initialResultFactory();
};


function LongestOccurrenceCounter(scanner, maximumResultLength){
  Counter.call(this, scanner, function(){ return new Array(); });
  if(maximumResultLength==undefined){
    this.maximumResultLength = 1;
  } else {
    this.maximumResultLength = maximumResultLength;
  }
};

LongestOccurrenceCounter.prototype = new Counter();

LongestOccurrenceCounter.prototype.processMatch = function(match){
  if (this.result.length < this.maximumResultLength){
    this.result.push(match);
    this.result.sort(function(a,b){
      return b.length - a.length;
    });
  } else if (this.result[this.result.length-1].length < match.length) {
    this.result.push(match);
    this.result.sort(function(a,b){
      return b.length - a.length;
    });
    this.result.length = this.maximumResultLength;
  }
};

function LongestUniqueOccurrenceCounter(scanner, maximumResultLength){
  LongestOccurrenceCounter.call(this, scanner, maximumResultLength);
};

LongestUniqueOccurrenceCounter.prototype = new LongestOccurrenceCounter();

LongestUniqueOccurrenceCounter.prototype.processMatch = function(match){
  match = match.toLowerCase();
  if (this.result.some(function(element){return element==match;})){
    // doing nothing, the match is already present in the result array
  } else {
    LongestOccurrenceCounter.prototype.processMatch.call(this, match);
  }
};
