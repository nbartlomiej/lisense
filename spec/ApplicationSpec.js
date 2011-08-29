describe("Application", function(){
  describe("creating new parser", function(){
    it("allows standard application flow", function(){
      parser = new Parser();

      wordScanner = new Scanner(/\w/, new Counter());
      wordNotifier = new WordNotifier(wordScanner);

      parser.scanners.push( wordScanner);
      parser.notifiers.push( new WordNotifier(wordScanner) );

      expect(parser.notifications.length).toEqual(0);

      var i=1000, text = 1; while (i--) text += 'Sample ';
      parser.run(text);

      expect(parser.notifications.length).toEqual(1);
    });
  });
});
