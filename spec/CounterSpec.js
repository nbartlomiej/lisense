describe("Counter", function(){
  var counter;
  beforeEach(function(){
    var wordScanner = new Scanner({scanners: new Array()}, /\b\S+\b/g);
    counter = new Counter(wordScanner);
  });
  describe('initializeCounter()', function(){
    it('initializes notifiers with empty array', function(){
      var object = {};
      Counter.prototype.initializeCounter.apply(object);
      expect(object.notifiers).toBeEmptyArray();
    });
  });
  describe("result", function(){
    it("is initialized with zero", function(){
      expect(counter.result).toEqual(0);
    });
  });
  describe("constructor", function(){
    it('stores the first argument as the scanner variable', function(){
      var argument = new Scanner({scanners: new Array()});
      var counter = new Counter(argument);
      expect(counter.scanner).toEqual(argument);
    });
    it('stores the second argument as the initializeResult variable', function(){
      var argument = jasmine.createSpy('result');
      var counter = new Counter(new Scanner({scanners: new Array()}), argument);
      expect(counter.initializeResult).toEqual(argument);
    });
    it('sets initializeResult if no second argument given', function(){
      var counter = new Counter(new Scanner({scanners: new Array()}));
      expect(counter.initializeResult).toBeDefined();
    });
    it('calls initializeResult variable', function(){
      var argument = jasmine.createSpy('result');
      var counter = new Counter(new Scanner({scanners: new Array()}), argument);
      expect(argument).toHaveBeenCalled();
    });
    it('adds self to the counters array of the argument', function(){
      var scanner = new Scanner({scanners: new Array()});
      spyOn(scanner.counters, 'push');
      var counter = new Counter(scanner);
      expect(scanner.counters.push).toHaveBeenCalledWith(counter);
    });
    it('invokes Counter.initializeCounter()', function(){
      spyOn(Counter.prototype, 'initializeCounter');
      var scanner = new Scanner({scanners: new Array()});
      var counter = new Counter(scanner);
      expect(Counter.prototype.initializeCounter).toHaveBeenCalled();
    });
  });
  describe("callback()", function(){
    it("increments result by one", function(){
      counter.callback();
      expect(counter.result).toEqual(1);
    });
  });
  describe("callNotifiers()", function(){
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
    it("invokes initializeResult", function(){
      spyOn(counter, 'initializeResult');
      counter.callNotifiers();
      expect(counter.initializeResult).toHaveBeenCalled();
    });
  });
});

describe('longestOccurrenceCounter', function(){
  var longestOccurrenceCounter;
  beforeEach(function(){
    var wordScanner = new Scanner({scanners: new Array()}, /\b\S+\b/g);
    longestOccurrenceCounter = new LongestOccurrenceCounter(wordScanner);
  });
  describe('constructor', function(){
    it('initializes with empty results array', function(){
      expect(longestOccurrenceCounter.results).toBeEmptyArray();
    });
    it('puts the second parameter into the resultsLength attribute', function(){
      var scanner = new Scanner({scanners: new Array()}, /1/);
      var length = jasmine.createSpy('resultsLength');
      var longestOccurrenceCounter = new LongestOccurrenceCounter(scanner, length);
      expect(longestOccurrenceCounter.resultsLength).toEqual(length);
    });
    it('applies Counter.initializeCounter()', function(){
      spyOn(Counter.prototype.initializeCounter, 'apply');
      var scanner = new Scanner({scanners: new Array()});
      var longestOccurrenceCounter = new LongestOccurrenceCounter(scanner);
      expect(Counter.prototype.initializeCounter.apply).toHaveBeenCalledWith(longestOccurrenceCounter);
    });
  });
  describe('resultsLength', function(){
    it('initializes with one', function(){
      expect(longestOccurrenceCounter.resultsLength).toEqual(1);
    });
  });
  describe("callback(match)", function(){
    it('puts match into results if results array is empty', function(){
      longestOccurrenceCounter.results = new Array();
      var match = jasmine.createSpy('match');
      longestOccurrenceCounter.callback(match);
      expect(longestOccurrenceCounter.results).toContain(match);
    });
    it('puts match into results if lesser results than resultsLength', function(){
      longestOccurrenceCounter.resultsLength = 5;
      longestOccurrenceCounter.results = new Array('a', 'b', 'c', 'd');
      longestOccurrenceCounter.callback('match');
      expect(longestOccurrenceCounter.results.length).toEqual(5);
    });
    it("puts match into results if it's longer than last result", function(){
      longestOccurrenceCounter.resultsLength = 3;
      longestOccurrenceCounter.results = new Array('1234', '123', '1');
      longestOccurrenceCounter.callback('22');
      expect(longestOccurrenceCounter.results).toContain('22');
    });
    it("ignores matches that are not longer than last result", function(){
      longestOccurrenceCounter.resultsLength = 3;
      longestOccurrenceCounter.results = new Array('1234', '123', '12');
      longestOccurrenceCounter.callback('22');
      expect(longestOccurrenceCounter.results).not.toContain('22');
    });
    it('sorts results and trims length to equal resultsLength', function(){
      longestOccurrenceCounter.resultsLength = 3;
      longestOccurrenceCounter.results = new Array('12345', '123', '12');
      longestOccurrenceCounter.callback('1234');
      var sortedTrimmedArray = new Array('12345', '1234', '123');
      expect(longestOccurrenceCounter.results).toEqual(sortedTrimmedArray);
    });
  });
});
