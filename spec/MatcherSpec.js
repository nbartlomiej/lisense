describe("Matcher", function() {
  var matcher;

  beforeEach(function(){
    matcher = new Matcher(/some_expression/);
  });

  describe("constructor", function(){
    it("stores the first argument as regular expression", function(){
      regularExpression = jasmine.createSpy();
      var matcher = new Matcher(regularExpression);
      expect(matcher.regularExpression).toEqual(regularExpression);
    });
    it("puts second and more arguments into the counters array", function(){
      var spyOne = jasmine.createSpy();
      var spyTwo = jasmine.createSpy();
      var matcher = new Matcher(/./, spyOne, spyTwo);
      expect(matcher.counters[0]).toEqual(spyOne);
      expect(matcher.counters[1]).toEqual(spyTwo);
    });
  });

  describe("regularExpression", function(){
    it("is passed as a first constructor parameter", function(){
      var regularExpression = /some_expression/;
      var matcher = new Matcher(regularExpression);
      expect(matcher.regularExpression).toEqual(regularExpression);
    });
    it("is a regular expression", function(){
      expect(matcher.regularExpression).toBeRegExp();
    });
  });

  describe('counters', function(){
    it ('is an array', function(){
      expect(matcher.counters).toBeArray();
    });
  });

  describe('parse()', function(){
    it ('applies regularExpression to the given string', function(){
      var regularExpression = /mock_regular_expression/;
      var matcher = new Matcher(regularExpression);
      var string = jasmine.createSpy('string');
      spyOn(regularExpression, 'exec');
      matcher.parse(string);
      expect(regularExpression.exec).toHaveBeenCalledWith(string);
    });
    it ("calls each counter's callback with each regexp match", function(){
      var matcher = new Matcher(/a/);
      matcher.counters.push({id: 1, callback: function(){}});
      matcher.counters.push({id: 2, callback: function(){}});
      matcher.counters.forEach(function(counter){ spyOn(counter, 'callback'); });
      matcher.parse('abc');
      matcher.counters.forEach(function(counter){
        expect(counter.callback).toHaveBeenCalledWith('a');
      });
    });
    it ("doesn't invoke anything when regexp doesn't match", function(){
      var matcher = new Matcher(/d/);
      matcher.counters.push({id: 1, callback: function(){}});
      matcher.counters.push({id: 2, callback: function(){}});
      matcher.counters.forEach(function(counter){ spyOn(counter, 'callback'); });
      matcher.parse('abc');
      matcher.counters.forEach(function(counter){
        expect(counter.callback).wasNotCalled();
      });
    });
  });

});
