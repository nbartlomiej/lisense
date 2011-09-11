function Notification(score){
  this.score = score;
};

Notification.prototype.kind = function(){
  if(this.score < 0) {
    return 'bad';
  } else if (this.score == 0) {
    return 'warning';
  } else {
    return 'good';
  }
};
