describe("Scanner", function() {
  var scanner;

  beforeEach(function(){
    scanner = new Scanner(/some_expression/);
  });

  describe("constructor", function(){
    it("stores the first argument as regular expression", function(){
      regularExpression = jasmine.createSpy();
      var scanner = new Scanner(regularExpression);
      expect(scanner.regularExpression).toEqual(regularExpression);
    });
    it("stores the second argument as the scanner's name", function(){
      var name = jasmine.createSpy('name');
      var scanner = new Scanner(/regexp/, name);
      expect(scanner.name).toEqual(name);
    });
    it("puts third and more arguments into the counters array", function(){
      var spyOne = jasmine.createSpy();
      var spyTwo = jasmine.createSpy();
      var scanner = new Scanner(/./, 'scannerName', spyOne, spyTwo);
      expect(scanner.counters[0]).toEqual(spyOne);
      expect(scanner.counters[1]).toEqual(spyTwo);
    });
  });

  describe("regularExpression", function(){
    it("is passed as a first constructor parameter", function(){
      var regularExpression = /some_expression/;
      var scanner = new Scanner(regularExpression);
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
    it ('applies regularExpression to the given string', function(){
      var regularExpression = /mock_regular_expression/;
      var scanner = new Scanner(regularExpression);
      var string = jasmine.createSpy('string');
      spyOn(regularExpression, 'exec');
      scanner.parse(string);
      expect(regularExpression.exec).toHaveBeenCalledWith(string);
    });
    it ("calls each counter's callback with each regexp match", function(){
      var scanner = new Scanner(/a/);
      scanner.counters.push({id: 1, callback: function(){}});
      scanner.counters.push({id: 2, callback: function(){}});
      scanner.counters.forEach(function(counter){ spyOn(counter, 'callback'); });
      scanner.parse('abc');
      scanner.counters.forEach(function(counter){
        expect(counter.callback).toHaveBeenCalledWith('a');
      });
    });
    it ("doesn't invoke anything when regexp doesn't match", function(){
      var scanner = new Scanner(/d/);
      scanner.counters.push({id: 1, callback: function(){}});
      scanner.counters.push({id: 2, callback: function(){}});
      scanner.counters.forEach(function(counter){ spyOn(counter, 'callback'); });
      scanner.parse('abc');
      scanner.counters.forEach(function(counter){
        expect(counter.callback).wasNotCalled();
      });
    });
  });
});
