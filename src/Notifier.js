function Notifier(){
  var that = this;
  // Converting arguments to Array object as we'd like to use the
  // Array.forEach() .
  argumentsArray = Array.prototype.slice.apply(arguments);
  argumentsArray.forEach(function(counter){
    counter.notifiers.push(that);
  });
  this.dataTree = {};
};

Notifier.prototype.callback = function(from, value){
  var pathArray = from.split('.');
  var scanner = pathArray[0];
  var property = pathArray[1];
  if (this.dataTree[scanner] == undefined) {this.dataTree[scanner] = {}; }
  this.dataTree[scanner][property] = value;
}
