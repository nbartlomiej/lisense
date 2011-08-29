function Counter(){
  this.result = 0;
};
Counter.prototype.callback = function(){
  this.result++;
};

function MatchLettersCounter(){
  this.result = new Array();
}
MatchLettersCounter.prototype.callback = function(match){
  this.result.push(match.length);
};

