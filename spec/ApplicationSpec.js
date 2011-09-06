describe("Application", function(){
  describe("creating new parser", function(){
    it("allows standard application flow", function(){
      var parser = new Parser();


      var wordScanner = new Scanner(/\w/, 'word');
      var wordCounter = new Counter(wordScanner);

      function WordNotifier(){};
      WordNotifier.prototype = new Notifier(wordCounter);
      WordNotifier.prototype.evaluate = function(){
        if (this.dataTree.word.counter > 180){
          parser.notifications.push('something wrong');
        }
      };

      expect(parser.notifications.length).toEqual(0);

      var i=1000, text = 1; while (i--) text += 'Sample ';
      parser.run(text);

      expect(parser.notifications.length).toEqual(1);
    });
  });
});
