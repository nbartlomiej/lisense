describe("Scanner", function() {
  var scanner;

  beforeEach(function(){
    scanner = new Scanner({scanners: new Array()}, /some_expression/);
  });

  describe("constructor", function(){
    it("adds self to the scanners array of the first argument", function(){
      var scannerGroup = new ScannerGroup();
      spyOn(scannerGroup.scanners, 'push');
      var scanner = new Scanner(scannerGroup, /\w/);
      expect(scannerGroup.scanners.push).toHaveBeenCalledWith(scanner);
    });
    it("stores the second argument as regular expression", function(){
      regularExpression = jasmine.createSpy();
      var scanner = new Scanner({scanners: new Array()}, regularExpression);
      expect(scanner.regularExpression).toEqual(regularExpression);
    });
  });

  describe("regularExpression", function(){
    it("is passed as a first constructor parameter", function(){
      var regularExpression = /some_expression/;
      var scanner = new Scanner({scanners: new Array()}, regularExpression);
      expect(scanner.regularExpression).toEqual(regularExpression);
    });
    it("is a regular expression", function(){
      expect(scanner.regularExpression).toBeRegExp();
    });
  });

  describe('counters', function(){
    it ('is an array', function(){
      expect(scanner.counters).toBeArray();
    });
  });

  describe('parse()', function(){
    // Cannot spy on String.match();
    //
    // it ('applies regularExpression to the given string', function(){
    //   var regularExpression = /sample regular expression/;
    //   var scanner = new Scanner({scanners: new Array()}, regularExpression);
    //   var string = 'sample string';
    //   spyOn(string, 'match');
    //   scanner.parse(string);
    //   expect(string.match).toHaveBeenCalledWith(regularExpression);
    // });
    it ("calls each counter's callback with each regexp match", function(){
      var scanner = new Scanner({scanners: new Array()}, /three/g);
      scanner.counters.push({callback: function(){}, callNotifiers: function(){}});
      scanner.counters.push({callback: function(){}, callNotifiers: function(){}});
      scanner.counters.forEach(function(counter){ spyOn(counter, 'callback'); });
      scanner.parse('one two three four three two one two three');
      scanner.counters.forEach(function(counter){
        expect(counter.callback).toHaveBeenCalledWith('three');
        expect(counter.callback.callCount).toEqual(3);
      });
    });
    it ("calls each counter's callNotifiers()", function(){
      var scanner = new Scanner({scanners: new Array()}, /a/);
      scanner.counters.push({callback: function(){}, callNotifiers: function(){}});
      scanner.counters.push({callback: function(){}, callNotifiers: function(){}});
      scanner.counters.forEach(function(counter){ spyOn(counter, 'callNotifiers'); });
      scanner.parse('abc');
      scanner.counters.forEach(function(counter){
        expect(counter.callNotifiers).toHaveBeenCalled();
      });
    });
    it ("doesn't invoke anything when regexp doesn't match", function(){
      var scanner = new Scanner({scanners: new Array()}, /five/);
      scanner.counters.push({callback: function(){}, callNotifiers: function(){}});
      scanner.counters.push({callback: function(){}, callNotifiers: function(){}});
      scanner.counters.forEach(function(counter){ spyOn(counter, 'callback'); });
      scanner.parse('one two three four');
      scanner.counters.forEach(function(counter){
        expect(counter.callback).wasNotCalled();
      });
    });
  });
});
