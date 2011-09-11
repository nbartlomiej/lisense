describe('Notification', function(){
  var notification;
  beforeEach( function(){
    notification = new Notification(1);
  });
  describe('constructor', function(){
    it('keeps first argument as the score variable', function(){
      var score = jasmine.createSpy('score');
      var notification = new Notification(score);
      expect(notification.score).toEqual(score);
    });
  });
  describe('kind()', function(){
    it('returns good for positive score', function(){
      notification.score = 1;
      expect(notification.kind()).toEqual('good');
    });
    it('returns bad for negative score', function(){
      notification.score = -1;
      expect(notification.kind()).toEqual('bad');
    });
    it('returns warning for zero score', function(){
      notification.score = 0;
      expect(notification.kind()).toEqual('warning');
    });
  });
});
