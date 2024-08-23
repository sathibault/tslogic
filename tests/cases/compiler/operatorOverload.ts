// @target: es2020
var N=3;
N.toLocaleString();
var a: UInt<8>;
a = 1;
a += 2;

var b: uint16 = 300;

const x: UInt<1> = { width: 1, value: 1};
const y: UInt<2> = x + x;
const z: UInt<2> = x + 1;


const FX_K = 32768;
const FX_SHR = 15;
const FX_ROUND = 16384;

function fx_mul(x: int32, y: int32) {
  var prod: int64 = int64(x)*int64(y);
  return int32(prod >> FX_SHR);
}
