describe("Application", function(){
  describe("ScannerGroup flow", function(){
    it("displays notifications through Scanner, Counter, Notifier", function(){
      var scannerGroup = new ScannerGroup();

      var wordScanner = new Scanner(scannerGroup, /\b\S+\b/g);
      var wordCounter = new Counter(wordScanner);

      var wordNotifier = new Notifier(wordCounter);
      wordNotifier.evaluate = function(wordCount){
        if (wordCount > 180){
          scannerGroup.notifications.push('something wrong');
        }
      };

      expect(scannerGroup.notifications.length).toEqual(0);

      var i=1000, text = 1; while (i--) text += 'Sample ';
      scannerGroup.parse(text);

      expect(scannerGroup.notifications.length).toEqual(1);
    });
    it("displays notifications through Scanner, LongestOccurrenceCounter, Notifier", function(){
      var scannerGroup = new ScannerGroup();

      var wordScanner = new Scanner(scannerGroup, /\b\S+\b/g);
      var threeLongestWords = new LongestOccurrenceCounter(wordScanner, 3);

      var wordNotifier = new Notifier(threeLongestWords);
      wordNotifier.evaluate = function(threeLongestWords){
        if (threeLongestWords.length == 3){
          if (threeLongestWords[2].length > 5) {
            scannerGroup.notifications.push('something wrong');
          }
        }
      };

      scannerGroup.parse('Two words.');

      expect(scannerGroup.notifications.length).toEqual(0);
      scannerGroup.parse('Qwerty qwerty qwert.');

      expect(scannerGroup.notifications.length).toEqual(0);
      scannerGroup.parse('Qwerty qwerty qwerty.');

      expect(scannerGroup.notifications.length).toEqual(1);
    });
  });
});
