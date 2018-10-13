const sort = require('../sort.js');

test("a test on valid input", () => {
	expect(sort.func1("1")).toEqual("invalid list");
	expect(sort.func1("1,a,3,6")).toEqual(1);
	expect(sort.func1("1,5,2,5,2")).toEqual([1,5,2,5,2]);

});
