describe("Counter", function(){
  describe("callback()", function(){
    it("increments result by one", function(){
      var counter = new Counter();
      counter.callback();
      expect(counter.result).toEqual(1);
    });
  });
  describe("result", function(){
    it("is initialized with zero", function(){
      var counter = new Counter();
      expect(counter.result).toEqual(0);
    });
  });
});

describe("MatchLettersCounter", function(){
  describe("callback(match)", function(){
    it("adds the matches' length to the results array", function(){
      var mlc = new MatchLettersCounter();
      mlc.callback('12345');
      expect(mlc.result[0]).toEqual(5);
    });
  });
  describe("result", function(){
    it("is an array", function(){
      var mlc = new MatchLettersCounter();
      expect(mlc.result).toBeArray();
    });
  });
});
