describe("Counter", function(){
  var counter;
  beforeEach(function(){
    counter = new Counter();
  });
  describe("name()", function(){
    it("equals 'counter'", function(){
      expect((new Counter()).name).toEqual('counter');
    });
  });
  describe("callback()", function(){
    it("increments result by one", function(){
      counter.callback();
      expect(counter.result).toEqual(1);
    });
  });
  describe("result", function(){
    it("is initialized with zero", function(){
      expect(counter.result).toEqual(0);
    });
  });
  describe("notifiers", function(){
    it("is an Array", function(){
      expect(counter.notifiers).toBeArray();
    });
  });
  describe("callNotifiers()", function(){
    it("browses through notifiers");
    it("invokes 'callback' on each notifier with counter's result", function(){
      var result = jasmine.createSpy();
      counter.result = result;
      var notifier1 = new Notifier();
      spyOn(notifier1, 'callback');
      var notifier2 = new Notifier();
      spyOn(notifier2, 'callback');
      counter.notifiers.push(notifier1, notifier2);
      counter.callNotifiers();
      expect(notifier1.callback).toHaveBeenCalledWith(result);
      expect(notifier2.callback).toHaveBeenCalledWith(result);
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
