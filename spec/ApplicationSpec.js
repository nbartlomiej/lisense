describe("Application", function(){
  describe("creating new parser", function(){
    it("allows standard application flow", function(){
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
  });
});
