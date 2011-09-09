var scannerGroup = new ScannerGroup();

var wordScanner = new Scanner(scannerGroup, /\b\S+\b/g);
var wordCounter = new Counter(wordScanner);

var wordNotifier = new Notifier(wordCounter);
wordNotifier.evaluate = function(wordCount){
  if (wordCount > 10){
    scannerGroup.notifications.push('something wrong');
  }
};


var onLoad = function(){
  var licenseTextarea = document.getElementById('license');
  licenseTextarea.onkeyup = function(){
    scannerGroup.parse(licenseTextarea.value);
  };
};

if(window.attachEvent) {
  window.attachEvent('onload', onLoad);
} else {
  if(window.onload) {
    var existingOnLoad = window.onload;
    var newOnLoad = function() {
      existingOnLoad();
      onLoad();
    };
    window.onload = newOnLoad;
  } else {
    window.onload = onLoad;
  }
}
