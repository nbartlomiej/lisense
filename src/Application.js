parser = new Parser();

wordScanner = new Scanner(/\w/, new Counter());
wordNotifier = new WordNotifier(wordScanner);

parser.matchers.push( wordScanner);
parser.notifiers.push( new WordNotifier(wordScanner) );

var onLoad = function(){
  var licenseTextarea = document.getElementById('license');
  licenseTextarea.onkeyup = function(){
    parser.parse(licenseTextarea.value);
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
