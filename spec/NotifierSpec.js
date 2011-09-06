describe("Notifier", function(){
  var notifier;
  beforeEach(function(){
    notifier = new Notifier();
  });
  describe("constructor", function(){
    it('adds self to the notifiers array of each argument', function(){
      var counter1 = new Counter({counters: new Array()});
      var counter2 = new Counter({counters: new Array()});
      new Array(counter1, counter2).forEach(function(counter){
        spyOn(counter.notifiers, 'push');
      });
      var notifier = new Notifier(counter1, counter2);
      new Array(counter1, counter2).forEach(function(counter){
        expect(counter.notifiers.push).toHaveBeenCalledWith(notifier);
      });
    });
    it("initializes with empty dataTree", function(){
      expect(notifier.dataTree).toBeEmptyObject();
    });
  });

  describe("callback(from, value)", function(){
    it("assigns the result into two-level dataTree path", function(){
      var result = jasmine.createSpy();
      notifier.callback('one.two', result);
      expect(notifier.dataTree.one.two).toEqual(result);
    });
  });
});
