
const things = require('../try');


test('string is not integer', () => {
  expect(things.a("1")).toBeFalsy();
});

test('5 is not negative', () => {
  expect(things.b(5)).toBeFalsy();
});
