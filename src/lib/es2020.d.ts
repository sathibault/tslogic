/// <reference lib="es2019" />
/// <reference lib="es2020.bigint" />
/// <reference lib="es2020.date" />
/// <reference lib="es2020.number" />
/// <reference lib="es2020.promise" />
/// <reference lib="es2020.sharedmemory" />
/// <reference lib="es2020.string" />
/// <reference lib="es2020.symbol.wellknown" />
/// <reference lib="es2020.intl" />


interface Bits {
  _bits: true;
}

interface RtlBits {
  _rtl: true;
}

interface UInt<W extends number> extends Bits {
  signed: false;
  data: W;
}
interface Int<W extends number> extends Bits {
  signed: true;
  data: W;
}

type bit = UInt<1>;
type uint8 = UInt<8>;
type uint16 = UInt<16>;
type uint32 = UInt<32>;
type uint64 = UInt<64>;
type int8 = Int<8>;
type int16 = Int<16>;
type int32 = Int<32>;
type int64 = Int<64>;
type float32 = number;
type float64 = number;
declare function uint8(x: number|Bits|RtlBits): UInt<8>;
declare function uint16(x: number|Bits|RtlBits): UInt<16>;
declare function uint32(x: number|Bits|RtlBits): UInt<32>;
declare function uint64(x: number|Bits|RtlBits): UInt<64>;
declare function int8(x: number|Bits|RtlBits): Int<8>;
declare function int16(x: number|Bits|RtlBits): Int<16>;
declare function int32(x: number|Bits|RtlBits): Int<32>;
declare function int64(x: number|Bits|RtlBits): Int<64>;
declare function float32(x: number|Bits|RtlBits): number;
declare function float64(x: number|Bits|RtlBits): number;
