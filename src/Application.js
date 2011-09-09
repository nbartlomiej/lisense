var scannerGroup = new ScannerGroup();

var wordScanner = new Scanner(scannerGroup, /\b\S+\b/g);
var wordCounter = new Counter(wordScanner);

var wordNotifier = new Notifier(wordCounter);
wordNotifier.evaluate = function(wordCount){
  if (wordCount > 180){
    console.log('Too many words per text: ' + wordCount);
    scannerGroup.notifications.push('something wrong');
  }
};

var characterScanner = new Scanner(scannerGroup, /\w/g);
var characterCounter = new Counter(characterScanner);

var sentenceScanner = new Scanner(scannerGroup, /[^\.]\./g);
var sentenceCounter = new Counter(sentenceScanner);

var ariNotifier = new Notifier(characterCounter, wordCounter, sentenceCounter);
ariNotifier.evaluate = function(characterCount, wordCount, sentenceCount){
  // var ariScore = 4.71 * (characterCount / wordCount) + 0.5 * (wordCount / sentenceCount) - 21.43;
  var ariScore = (4.71 * (characterCount / wordCount)) + (0.5 * (wordCount / sentenceCount)) - 21.43;
  console.log('Your ari score is: ' + ariScore);
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
