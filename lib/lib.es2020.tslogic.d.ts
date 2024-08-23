/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */



/// <reference no-default-lib="true"/>


export {}; // Make this a module

declare global {
  class Bits {}
  class UInt<W extends number> extends Bits {
  }
  class Int<W extends number> extends Bits {
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
  function uint8(x: Bits): UInt<8>;
  function uint16(x: Bits): UInt<16>;
  function uint32(x: Bits): UInt<32>;
  function uint64(x: Bits): UInt<64>;
  function int8(x: Bits): Int<8>;
  function int16(x: Bits): Int<16>;
  function int32(x: Bits): Int<32>;
  function int64(x: Bits): Int<64>;
  function float32(x: Bits): number;
  function float64(x: Bits): number;
}