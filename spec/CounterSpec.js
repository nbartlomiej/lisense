describe("Counter", function(){
  var counter;
  beforeEach(function(){
    var wordScanner = new Scanner({scanners: new Array()}, /\b\S+\b/g);
    counter = new Counter(wordScanner);
  });
  describe("result", function(){
    it("is initialized with zero", function(){
      expect(counter.result).toEqual(0);
    });
  });
  describe("notifiers", function(){
    it("is initialized with empty array", function(){
      expect(counter.notifiers).toBeEmptyArray();
    });
  });
  describe('ignorePatterns', function(){
    it("is initialized with empty array", function(){
      expect(counter.ignorePatterns).toBeEmptyArray();
    });
  });
  describe("constructor", function(){
    it('can be called without parameters', function(){
      // TODO: convert to expectation not to throw any exceptions
      var counter = new Counter();
    });
    it('stores the first argument as the scanner variable', function(){
      var argument = new Scanner({scanners: new Array()});
      var counter = new Counter(argument);
      expect(counter.scanner).toEqual(argument);
    });
    it('stores the second argument as the initialResultFactory variable', function(){
      var argument = jasmine.createSpy('result');
      var counter = new Counter(new Scanner({scanners: new Array()}), argument);
      expect(counter.initialResultFactory).toEqual(argument);
    });
    it('sets result to the initialResultFactory() value', function(){
      var initialResultFactoryValue = jasmine.createSpy('initialResultFactoryValue');
      var counter = new Counter(
        new Scanner({scanners: new Array()}),
        function(){ return initialResultFactoryValue; }
      );
      expect(counter.result).toEqual(initialResultFactoryValue);
    });
    it('initialResultFactory() returns zero if no second argument given', function(){
      expect(counter.initialResultFactory()).toEqual(0);
    });
    it('adds self to the counters array of the argument', function(){
      var scanner = new Scanner({scanners: new Array()});
      spyOn(scanner.counters, 'push');
      var counter = new Counter(scanner);
      expect(scanner.counters.push).toHaveBeenCalledWith(counter);
    });
  });
  describe("callback()", function(){
    it("calls processMatch() if match not caught by ignorePatterns", function(){
      counter.ignorePatterns = new Array();
      spyOn(counter, 'processMatch');
      counter.callback('sample_word');
      expect(counter.processMatch).toHaveBeenCalledWith('sample_word');
    });
    it("doesn't call processMatch() if match caught by ignorePatterns", function(){
      counter.ignorePatterns = new Array(/zero/, /two/);
      spyOn(counter, 'processMatch');
      counter.callback('one');
      counter.callback('two');
      counter.callback('three');
      expect(counter.processMatch).not.toHaveBeenCalledWith('two');
      expect(counter.processMatch).toHaveBeenCalledWith('one');
      expect(counter.processMatch).toHaveBeenCalledWith('three');
    });
  });
  describe("processMatch()", function(){
    it("increments result by one", function(){
      counter.processMatch();
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
    it("notifier's 'callback' is invoked with counter and result", function(){
      var scanner = new Scanner({scanners: new Array()}, /1/, 'one');
      var notifier = new Notifier();
      var counter = new Counter(scanner);
      var result = counter.result = jasmine.createSpy('result');
      counter.notifiers.push(notifier);

      spyOn(notifier, 'callback');
      counter.callNotifiers();
      expect(notifier.callback).toHaveBeenCalledWith(counter, result);
    });
    it("assigns initialResultFactory value to result", function(){
      var initialResultFactoryValue = jasmine.createSpy('initialResultFactoryValue');
      spyOn(counter, 'initialResultFactory').andReturn(initialResultFactoryValue);
      counter.callNotifiers();
      expect(counter.result).toEqual(initialResultFactoryValue);
    });
  });
});

describe('LongestOccurrenceCounter', function(){
  var longestOccurrenceCounter;
  beforeEach(function(){
    var wordScanner = new Scanner({scanners: new Array()}, /\b\S+\b/g);
    longestOccurrenceCounter = new LongestOccurrenceCounter(wordScanner);
  });
  describe('constructor', function(){
    it('initializes with empty result array', function(){
      expect(longestOccurrenceCounter.result).toBeEmptyArray();
    });
    it('puts the second parameter into the maximumResultLength attribute', function(){
      var scanner = new Scanner({scanners: new Array()}, /1/);
      var length = jasmine.createSpy('maximumResultLength');
      var longestOccurrenceCounter = new LongestOccurrenceCounter(scanner, length);
      expect(longestOccurrenceCounter.maximumResultLength).toEqual(length);
    });
  });
  describe('maximumResultLength', function(){
    it('initializes with one', function(){
      expect(longestOccurrenceCounter.maximumResultLength).toEqual(1);
    });
  });
  describe("processMatch(match)", function(){
    it('puts match into result if result array is empty', function(){
      longestOccurrenceCounter.result = new Array();
      var match = jasmine.createSpy('match');
      longestOccurrenceCounter.processMatch(match);
      expect(longestOccurrenceCounter.result).toContain(match);
    });
    it('puts match into result if lesser results than maximumResultLength', function(){
      longestOccurrenceCounter.maximumResultLength = 5;
      longestOccurrenceCounter.result = new Array('a', 'b', 'c', 'd');
      longestOccurrenceCounter.processMatch('match');
      expect(longestOccurrenceCounter.result.length).toEqual(5);
    });
    it("puts match into result if it's longer than last result", function(){
      longestOccurrenceCounter.maximumResultLength = 3;
      longestOccurrenceCounter.result = new Array('1234', '123', '1');
      longestOccurrenceCounter.processMatch('22');
      expect(longestOccurrenceCounter.result).toContain('22');
    });
    it("ignores matches that are not longer than last result", function(){
      longestOccurrenceCounter.maximumResultLength = 3;
      longestOccurrenceCounter.result = new Array('1234', '123', '12');
      longestOccurrenceCounter.processMatch('22');
      expect(longestOccurrenceCounter.result).not.toContain('22');
    });
    it('sorts result and trims length to equal maximumResultLength', function(){
      longestOccurrenceCounter.maximumResultLength = 3;
      longestOccurrenceCounter.result = new Array('12345', '123', '12');
      longestOccurrenceCounter.processMatch('1234');
      var sortedTrimmedArray = new Array('12345', '1234', '123');
      expect(longestOccurrenceCounter.result).toEqual(sortedTrimmedArray);
    });
  });
});

describe('LongestUniqueOccurrenceCounter', function(){
  var longestUniqueOccurrenceCounter;
  beforeEach(function(){
    var wordScanner = new Scanner({scanners: new Array()}, /\b\S+\b/g);
    longestUniqueOccurrenceCounter = new LongestUniqueOccurrenceCounter(wordScanner);
  });
  describe('processMatch()', function(){
    it('calls LongestOccurrenceCounter when match not in result', function(){
      var match = jasmine.createSpy();
      longestUniqueOccurrenceCounter.result = new Array();
      spyOn(LongestOccurrenceCounter.prototype, 'processMatch');
      longestUniqueOccurrenceCounter.processMatch(match);
      expect(LongestOccurrenceCounter.prototype.processMatch).toHaveBeenCalledWith(match);
    });
    it('doesn not call LongestOccurrenceCounter when match is in result', function(){
      var match = jasmine.createSpy();
      longestUniqueOccurrenceCounter.result = new Array(match);
      spyOn(LongestOccurrenceCounter.prototype, 'processMatch');
      longestUniqueOccurrenceCounter.processMatch(match);
      expect(LongestOccurrenceCounter.prototype.processMatch).not.toHaveBeenCalled();
    });
  });
});
