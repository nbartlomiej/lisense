var scannerGroup = new ScannerGroup();
scannerGroup.updateView = function(){
  var scoresElement = document.getElementById('scores');
  if (scoresElement.style.display !='block') { scoresElement.style.display ='block'; }
  var globalScore = 0;
  var notificationsElement = document.getElementById('notifications');
  notificationsElement.innerHTML = '';
  // sorting notifications from the most important one to the least
  this.notifications.sort(function(a, b){
    return Math.abs(a.score) - Math.abs(b.score);
  });
  // adding html to the site
  this.notifications.forEach(function(n){
    globalScore += n.score;
    var message ="<div class='notification "+n.kind()+"'>";
    message += n.description+"</div>";
    var score = n.score.toFixed(0);
    if (score>=0) {score = '+' + score;}
    message += "<div class='notification-score'>"+score+"</div>";
    notificationsElement.insertAdjacentHTML('afterbegin', message );
  });
  var scoreElement = document.getElementById('score');
  // preventing -0 (minus zero) from being displayed as a score
  if (Math.abs(globalScore).toFixed(0) == 0) globalScore = 0;
  scoreElement.innerHTML = globalScore.toFixed(0);
  this.notifications = new Array();
};

var wordScanner = new Scanner(scannerGroup, /\b\S+\b/g);
var wordCounter = new Counter(wordScanner);

var characterScanner = new Scanner(scannerGroup, /\w/g);
var characterCounter = new Counter(characterScanner);

var sentenceScanner = new Scanner(scannerGroup, /[^.!?\s][^.!?\n]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g);
var sentenceCounter = new Counter(sentenceScanner);

var fourLongestSentences = new LongestOccurrenceCounter(sentenceScanner, 4);
var tenLongestWords = new LongestUniqueOccurrenceCounter(wordScanner, 10);
// When counting long words, ignore hyperlinks (http://link, www.link,
// link.com), and alternations (e.g.: states/jurisdictions).
tenLongestWords.ignorePatterns.push(/(http:\/\/)|(HTTP:\/\/)/g, /(www)|(WWW)/g, /\./g, /\//g);

var hyperlinkScanner = new Scanner(scannerGroup, /http:\/\//g);
var hyperlinkCounter = new Counter(hyperlinkScanner);

var wordNotifier = new Notifier(wordCounter);
wordNotifier.evaluate = function(wordCount){
  var wordsPerPage = 250;
  var pages = (wordCount / wordsPerPage).toFixed(1);
  var score = (pages - 2) * (-10);
  var notification = new Notification(score);
  if (pages > 100){
    notification.description = "More than " + (wordCount/wordsPerPage).toFixed(0) + " pages, that's a candidate for a novel. This license should be much shorter.";
  } else if (wordCount > 7500){
    notification.description = "More than " + (wordCount/wordsPerPage).toFixed(0) + " pages and " + wordCount + " words, that's a candidate for a <a href='http://en.wikipedia.org/wiki/Novelette'>novelette</a>. This license should be much shorter.";
  } else if (pages > 10){
    notification.description = "So many words! This license is more than " + (wordCount/wordsPerPage).toFixed(0) + " pages long. That doesn't sound too user-friendly.";
  } else if (pages >= 2){
    notification.description = "This license is more than " + (wordCount/wordsPerPage).toFixed(0) + " pages long. That doesn't sound too user-friendly.";
  } else if (pages > 1) {
    notification.description = "This license is less than two pages long; that's a reasonable amount of text.";
  } else if (pages > 0.1) {
    notification.description = "This license is amazingly short, that's a huge plus!";
    notification.score = notification.score * notification.score;
  } else {
    notification.description = "Little or no text detected. Please write a few kind sentences and show the user that you care for him.";
    notification.score = 0;
  }
  scannerGroup.notifications.push(notification);
};

var ariNotifier = new Notifier(characterCounter, wordCounter, sentenceCounter);
ariNotifier.evaluate = function(characterCount, wordCount, sentenceCount){
  var ariScore = (4.71 * (characterCount / wordCount)) + (0.5 * (wordCount / sentenceCount)) - 21.43;
  var score = (ariScore * (-1) + 16) * 10;
  var notification = new Notification(score);
  if (ariScore < 12 && ariScore >= 1) {
    var years = (ariScore + 6).toFixed(0);
    notification.description = "Good readability! According to <a href='http://en.wikipedia.org/wiki/Automated_Readability_Index'>Automated Readability Index</a>, this text is understandable for anyone aged " + years + " and above.";
    scannerGroup.notifications.push(notification);
  }
};

// TODO: write a counter that passes the occurences from scanner to notifier;
// list the hyperlink occurences in the notification description.
var hyperlinkNotifier = new Notifier(hyperlinkCounter);
hyperlinkNotifier.evaluate = function(hyperlinkCount){
  if (hyperlinkCount>0){
    var notification = new Notification(hyperlinkCount*(-9) - 50);
    notification.description = "Found hyperlinks, amount: " + hyperlinkCount + ". It's more difficult to read such text, especially on mobile devices or when printed.";
    scannerGroup.notifications.push(notification);
  }
};

// TODO: convert to work on longest sentences by word count and not on longest
// sentences by character count.
var sentenceLengthNotifier = new Notifier(fourLongestSentences);
sentenceLengthNotifier.evaluate = function(fourLongestSentences){
  fourLongestSentences.forEach(function(sentence){
    if (sentence.length > 1000){
      var score = sentence.length  * (-10 / 500);
      var notification = new Notification(score);
      notification.description = "Mammoth-sized sentence found: \"" + sentence.substring(0,100)+"...\" (" + sentence.length + " characters).";
      scannerGroup.notifications.push(notification);
    } else if (sentence.length > 500){
      var score = sentence.length  * (-10 / 500);
      var notification = new Notification(score);
      notification.description = "The following sentence: \"" + sentence.substring(0,100)+"...\" is too long (" + sentence.length + " characters)."
      scannerGroup.notifications.push(notification);
    }
  });
};

var wordLengthNotifier = new Notifier(tenLongestWords);
wordLengthNotifier.evaluate = function(tenLongestWords){
  if (tenLongestWords.length > 0){
    if (tenLongestWords[tenLongestWords.length - 1].length >= 14){
      var score = 0;
      tenLongestWords.forEach(function(word){score += (word.length-13)*(-1.2);});
      var notification = new Notification(score);
      notification.description = 'Multiple long words: ' + tenLongestWords.join(', ') + '.';
      scannerGroup.notifications.push(notification);
    }
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

// TODO: Refactor. Note though: the AJAX calls cannot hit foreign urls,
// therefore no license scraping on-the-fly is possible with only client-side
// code.

function loadMitLicense(){
  var licenseTextarea = document.getElementById('license');
  licenseTextarea.value = 'Copyright (C) <year> by <copyright holders>\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.';
  scannerGroup.parse(licenseTextarea.value);
}
