function Notifier(){
  this.counters = new Array();
  this.temporaryResults = new Array();
  var that = this;
  // Converting arguments to Array object as we'd like to use the
  // Array.forEach() .
  argumentsArray = Array.prototype.slice.apply(arguments);
  argumentsArray.forEach(function(counter){
    counter.notifiers.push(that);
    that.counters.push(counter);
  });
  this.dataTree = {};
};

Notifier.prototype.callback = function(from, value){
  var order = this.counters.indexOf(from);
  this.temporaryResults[order] = value;
  var results_length = 0;
  for (var occurence in this.temporaryResults) {results_length++;}
  if (results_length == this.counters.length){
    this.evaluate.apply(this, this.temporaryResults);
    this.temporaryResults = new Array();
  }
};

Notifier.prototype.evaluate = function(){
};
