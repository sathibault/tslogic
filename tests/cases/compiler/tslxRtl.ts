// @target: es2020

type RtlScalar = Bits | boolean;

interface RtlExpr<T extends RtlScalar> extends RtlBits {
  val?: T;
  build(): void;
}

class Signal<T extends RtlScalar> implements RtlExpr<T> {
  _rtl: true;
  build() {
  }
}

class Driver<T extends RtlScalar> {
  is<U extends RtlScalar>(val: RtlExpr<T>, cond?: (x:any) => RtlExpr<U>) {
  }
}

var x = new Signal<Int<8>>();
var y = new Signal<Int<8>>();
var z = x + y;
z += z;
var b = z == 5;

var dr = new Driver<bit>();
dr.is(1, when => x==5);
dr.is(x == 1);

function signal<T extends RtlScalar>(init?: T) {
  return new Signal<T>();
}

function Heartbeat() {
  var counter = signal<uint32>(0);
  var valid = signal<bit>(0);
  var accept = signal<bit>();
  var zero = signal<bit>();

  var d = new Driver<UInt<32>>();
  d.is(counter + 1);

  var v = new Driver<bit>();
  v.is(1, when => counter == 1e6);
  v.is(0, when => valid & accept);
}

var i32 = new Signal<Int<32>>();
i32 = 1;
var xd = new Driver<Int<8>>();
xd.is(int8(i32 & 255));

