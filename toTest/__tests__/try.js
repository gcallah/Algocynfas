
const things = require('../try');


test('string is not integer', () => {
  expect(things.a("1")).toBeFalsy();
});

test('a valid list', () => {
const myMockFn = jest
  .fn(() => 'default')
  .mockImplementationOnce(() => 1)
  .mockImplementationOnce(() => 2);

console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn());
 expect(things.b(-4)).toBe(0);
});

