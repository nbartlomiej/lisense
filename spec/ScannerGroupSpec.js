describe("ScannerGroup", function(){
  describe("parse()", function(){
    it("calls parse() on each scanner", function(){
      var scannerGroup = new ScannerGroup();
      var scanner1 = new Scanner(scannerGroup, /1/);
      var scanner2 = new Scanner(scannerGroup, /2/);
      var text = jasmine.createSpy();
      spyOn(scanner1, 'parse');
      spyOn(scanner2, 'parse');
      scannerGroup.parse(text);
      expect(scanner1.parse).toHaveBeenCalledWith(text);
      expect(scanner2.parse).toHaveBeenCalledWith(text);
    });
  });
});
