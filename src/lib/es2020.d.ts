/// <reference lib="es2019" />
/// <reference lib="es2020.bigint" />
/// <reference lib="es2020.date" />
/// <reference lib="es2020.number" />
/// <reference lib="es2020.promise" />
/// <reference lib="es2020.sharedmemory" />
/// <reference lib="es2020.string" />
/// <reference lib="es2020.symbol.wellknown" />
/// <reference lib="es2020.intl" />


interface Bits {}
interface UInt<W extends number> extends Bits {
}
interface Int<W extends number> extends Bits {
}
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
declare function uint8(x: Bits): UInt<8>;
declare function uint16(x: Bits): UInt<16>;
declare function uint32(x: Bits): UInt<32>;
declare function uint64(x: Bits): UInt<64>;
declare function int8(x: Bits): Int<8>;
declare function int16(x: Bits): Int<16>;
declare function int32(x: Bits): Int<32>;
declare function int64(x: Bits): Int<64>;
declare function float32(x: Bits): number;
declare function float64(x: Bits): number;
