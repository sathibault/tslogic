// @target: es2020
var N=3;
N.toLocaleString();
var a: UInt<8>;
a = 1;
a += 2;

var b: uint16 = 300;

const x: UInt<1> = 1;
const y: UInt<1> = x + x;
const z: UInt<2> = x #+ 1;

const FX_SHR: uint8 = 15;

function fx_mul(x: int32, y: int32) {
  var prod: int64 = x #* y;
  return int32(prod >> FX_SHR);
}
