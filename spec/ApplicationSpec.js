describe("Application", function(){
  describe("creating new parser", function(){
    it("allows standard application flow", function(){
      var parser = new Parser();

      var wordScanner = new Scanner(/\w/);

      var wordCounter = new Counter();
      wordScanner.counters.push(wordCounter);

      var wordNotifier = new WordNotifier();
      wordCounter.notifiers.push(wordNotifier);

      expect(parser.notifications.length).toEqual(0);

      var i=1000, text = 1; while (i--) text += 'Sample ';
      parser.run(text);

      expect(parser.notifications.length).toEqual(1);
    });
  });
});
