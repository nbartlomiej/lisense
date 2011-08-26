describe("Matcher", function() {
  var matcher;

  beforeEach(function(){
    matcher = new Matcher(/some_expression/);
  });

  describe("regularExpression", function(){
    it("is passed as a first constructor parameter", function(){
      var regularExpression = /some_expression/;
      var matcher = new Matcher(regularExpression);
      expect(matcher.regularExpression).toEqual(regularExpression);
    });
  });
  describe('counters', function(){
    it ('is an array', function(){
      expect(matcher.counters).toBeArray();
    });
  });
});
