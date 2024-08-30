// @target: es2020

interface RtlExpr<T extends Bits> {
  val?: T;
  build(): void;
}

class Signal<T extends Bits> implements RtlExpr<T> {
  build() {
  }
}

class Driver<T> {
  is<U>(val: RtlExpr<T>, cond?: (x:any) => RtlExpr<U>) {
  }
}

var x = new Signal<Int<8>>();
var y = new Signal<Int<8>>();
var z = x + y;
z += z;
var b = z == 5;

var dr = new Driver<bit>();
dr.is(1, when => x==5);

type bit = UInt<1>;
function signal<T>(init?: T) {
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
