describe("Counter", function(){
  var counter;
  beforeEach(function(){
    var wordScanner = new Scanner({scanners: new Array()}, /\w/);
    counter = new Counter(wordScanner);
  });
  describe("constructor", function(){
    it('stores the first argument as the scanner variable', function(){
      var argument = new Scanner({scanners: new Array()});
      var counter = new Counter(argument);
      expect(counter.scanner).toEqual(argument);
    });
    it('adds self to the counters array of the argument', function(){
      var scanner = new Scanner({scanners: new Array()});
      spyOn(scanner.counters, 'push');
      var counter = new Counter(scanner);
      expect(scanner.counters.push).toHaveBeenCalledWith(counter);
    });
  });
  describe("name()", function(){
    it("equals 'counter'", function(){
      expect(counter.name).toEqual('counter');
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
    it("invokes 'callback' on each notifier", function(){
      for(var i=0; i<4; i++){
        var notifier = new Notifier();
        spyOn(notifier, 'callback');
        counter.notifiers.push(notifier);
      }
      counter.callNotifiers();
      counter.notifiers.forEach(function(n){ expect(n.callback).toHaveBeenCalled() });
    });
    it("'callback' is invoked with counter and result", function(){
      var scanner = new Scanner({scanners: new Array()}, /1/, 'one');
      var notifier = new Notifier();
      var counter = new Counter(scanner);
      var result = counter.result = jasmine.createSpy('result');
      counter.notifiers.push(notifier);

      spyOn(notifier, 'callback');
      counter.callNotifiers();
      expect(notifier.callback).toHaveBeenCalledWith(counter, result);
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
