//// [tslxModule.ts]
@module('rtl')
function foo() {
  console.log('hello');
}

@module('rtl')
const bar = function () {
  @start foo();
}


//// [tslxModule.js]
@module('rtl')
function foo() {
    console.log('hello');
}
@module('rtl')
var bar = function () {
    @start
    foo();
};
