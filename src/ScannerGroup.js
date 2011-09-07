function ScannerGroup(){
  this.notifications = new Array();
  this.scanners = new Array();
};

ScannerGroup.prototype.parse = function(text){
  this.scanners.forEach(function(scanner){
    scanner.parse(text);
  });
};
