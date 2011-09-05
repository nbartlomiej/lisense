function Counter(){
  this.result = 0;
  this.name = 'counter';
  this.notifiers = new Array();
};
Counter.prototype.callback = function(){
  this.result++;
};
Counter.prototype.callNotifiers = function(){
};

function MatchLettersCounter(){
  this.result = new Array();
}
MatchLettersCounter.prototype.callback = function(match){
  this.result.push(match.length);
};

