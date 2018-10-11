const widgets = require('../widgets.js');


test("letter Num convert is fine", () => {

	expect(widgets.func1(1)).toBe("b");
});



test("Correct legend is created", () => {

	expect(widgets.func2("a","b",	"#008000", "#00FFFF")).toEqual({    
		"data": [{
			"title": "a",
			"color": "#008000",
		},
		{
			"title": "b",
			"color": "#00FFFF",
		}]
	});

});


test("Make string input to list is fine", () => {
	expect(widgets.func3("1,2  ,32,3,  4, 5",true)).toEqual(["1","2","32","3","4","5"]);
	expect(widgets.func3("1,2,3,4,5")).toEqual(["1","2","3","4","5"]);
});


