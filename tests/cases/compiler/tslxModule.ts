@module('rtl')
function foo() {
  console.log('hello');
}

@module('rtl')
const bar = function () {
  @start foo();
}
