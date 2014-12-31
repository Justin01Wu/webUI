
describe('test app itself', function() {

  // You need to load modules that you want to test,
  // it loads only the "ng" module by default.
  beforeEach(module('myApp2'));
  
  var foo;
  beforeAll(function() {
    foo = 1;
  });
 
  it("contains spec with an expectation", function() {
    console.log('contains spec with an expectation');
    expect(true).toBe(true);
  });
  
  it("The 'toBeDefined' matcher compares against `undefined`", function() {
    console.log("The 'toBeDefined' matcher compares against `undefined`");
    var a = {
      foo: "foo"
    };
    expect(a.foo).toBeDefined();
	expect(a.foo).toEqual("foo");
    expect(a.bar).not.toBeDefined();
  });



  // inject() is used to inject arguments of all given functions
  it('should provide a version', inject(function(mode, version) {
    expect(version).toEqual('v1.0.1');
    expect(mode).toEqual('app');
  }));
  
  // another test suite can be nested in this test suite
	describe("test controller", function() {
		
		//  because it is nested inside app test suite, so we don't need load module again
		//beforeEach(function () {
		//	module('myApp2');
		//});
		
		var ctrl, scope;
		var $httpBackend;
		// read: http://docs.angularjs.org/api/ngMock.$httpBackend
		beforeEach(inject(function ($rootScope, _$controller_, _$httpBackend_) {		
		
			$httpBackend = _$httpBackend_;
			scope = $rootScope.$new();
			ctrl = _$controller_('personController', {
				$scope: scope
			});	
		}));


		it('should have personController', function() {
			expect(ctrl).toBeDefined();
		});

		it('personController should have firstName', function() {
			console.log('personController should have firstName');
			
			expect(ctrl).toBeDefined();
			expect(scope.firstName).toBeDefined();
			expect(scope.firstName).toEqual("Justin");
		});
		
		
		it('should fetch new person', function () {		
		
			$httpBackend.expectGET('/user/1').respond({ id: 1, firstName: 'a', lastName: "b" });			
	  
			expect(scope.firstName).toEqual("Justin");
			scope.retrieveNewPerson();
			$httpBackend.flush();

			expect(scope.firstName).toEqual("a");
			expect(scope.lastName).toEqual("b");
    
		});

	});

});

	// third test suite can be put in the same file
	describe("test nothing", function() {
	});







