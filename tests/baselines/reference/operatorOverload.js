//// [operatorOverload.ts]
var N=3;
N.toLocaleString();
var a: UInt<8>;
a = 1;
a += 2;

var b: uint16 = 300;

const x: UInt<1> = { width: 1, value: 1};
const y: UInt<2> = x + x;
const z: UInt<2> = x + 1;


//// [operatorOverload.js]
var N = 3;
N.toLocaleString();
var a;
a = 1;
a += 2;
var b = 300;
const x = { width: 1, value: 1 };
const y = x + x;
const z = x + 1;
