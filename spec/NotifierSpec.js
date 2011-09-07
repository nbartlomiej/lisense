describe("Notifier", function(){
  var counter1;
  var counter2;
  var notifier;
  beforeEach(function(){
      counter1 = new Counter({counters: new Array()});
      counter2 = new Counter({counters: new Array()});
      notifier = new Notifier(counter1, counter2);
  });
  describe("constructor", function(){
    it('adds self to the notifiers array of each argument', function(){
      new Array(counter1, counter2).forEach(function(counter){
        spyOn(counter.notifiers, 'push');
      });
      notifier = new Notifier(counter1, counter2);
      new Array(counter1, counter2).forEach(function(counter){
        expect(counter.notifiers.push).toHaveBeenCalledWith(notifier);
      });
    });
    it('adds arguments to the counters array', function(){
      notifier = new Notifier(counter1, counter2);
      expect(notifier.counters).toContain(counter1);
      expect(notifier.counters).toContain(counter2);
    });
  });

  describe("callback(from, value)", function(){
    it("stores the result in the temporaryResults array", function(){
      var counter = new Counter({counters: new Array()});
      var notifier = new Notifier(counter);
      var value = jasmine.createSpy('value');
      notifier.callback(counter, value);
      expect(notifier.temporaryResults).toContain(value);
    });
    it("positions temporaryResults according to parameter ordering", function(){
      var value2 = jasmine.createSpy('value2');
      notifier.callback(counter2, value2);
      expect(notifier.temporaryResults[1]).toEqual(value2);
    });
    it("doesn't call evaluate() when not all parameters are present", function(){
      spyOn(notifier, 'evaluate');
      notifier.callback(counter1, jasmine.createSpy('value1'));
      expect(notifier.evaluate).not.toHaveBeenCalled();
    });
    it("calls evaluate() when all parameters are present", function(){
      var value1 = jasmine.createSpy('value1');
      var value2 = jasmine.createSpy('value2');
      spyOn(notifier, 'evaluate');
      notifier.callback(counter1, value1);
      notifier.callback(counter2, value2);
      expect(notifier.evaluate).toHaveBeenCalledWith(value1, value2);
    });
  });
});
