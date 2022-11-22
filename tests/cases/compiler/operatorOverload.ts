class UInt<W extends number> {
  width: W;
  value: number;
  constructor(w: W, v: number) {
    this.width=w;
    this.value=v;
  }
}

const x: UInt<1> = { width: 1, value: 1};
const y: UInt<2> = x + x;