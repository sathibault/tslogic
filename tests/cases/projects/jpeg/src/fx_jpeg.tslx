const fs = require('fs');

const s_jo_ZigZag: uint8[] = [0, 1, 5, 6, 14, 15, 27, 28, 2, 4, 7, 13, 16, 26, 29, 42, 3, 8, 12, 17, 25, 30, 41, 43, 9, 11, 18, 24, 31, 40, 44, 53, 10, 19, 23, 32, 39, 45, 52, 54, 20, 22, 33, 38, 46, 51, 55, 60, 21, 34, 37, 47, 50, 56, 59, 61, 35, 36, 48, 49, 57, 58, 62, 63];

const FX_K: int32 = 32768;
const FX_SHR: uint8 = 15;
const FX_ROUND: int32 = 16384;

function len(a: ArrayLike<number>) {
	return a.length;
}

const L = len(s_jo_ZigZag);

function fx_mul(x: int32, y: int32) {
  var prod: int64 = int64(x)*int64(y);
  return int32(prod >> FX_SHR);
}

function jo_DCT(d0: int32, d1: int32, d2: int32, d3: int32, d4: int32, d5: int32, d6: int32, d7: int32): [int32, int32, int32, int32, int32, int32, int32, int32] {
  var tmp0: int32 = d0 + d7;
  var tmp7: int32 = d0 - d7;
  var tmp1: int32 = d1 + d6;
  var tmp6: int32 = d1 - d6;
  var tmp2: int32 = d2 + d5;
  var tmp5: int32 = d2 - d5;
  var tmp3: int32 = d3 + d4;
  var tmp4: int32 = d3 - d4;
  var tmp10: int32 = tmp0 + tmp3;
  var tmp13: int32 = tmp0 - tmp3;
  var tmp11: int32 = tmp1 + tmp2;
  var tmp12: int32 = tmp1 - tmp2;
  d0 = tmp10 + tmp11;
  d4 = tmp10 - tmp11;
  var z1: int32 = fx_mul((tmp12 + tmp13), 23170);;
  d2 = tmp13 + z1;
  d6 = tmp13 - z1;
  tmp10 = tmp4 + tmp5;
  tmp11 = tmp5 + tmp6;
  tmp12 = tmp6 + tmp7;
  var z5: int32 = fx_mul((tmp10 - tmp12), 12540);
  var z2: int32 = fx_mul(tmp10, 17734) + z5;
  var z4: int32 = fx_mul(tmp12, 42813) + z5;
  var z3: int32 = fx_mul(tmp11, 23170);
  var z11: int32 = tmp7 + z3;
  var z13: int32 = tmp7 - z3;
  d5 = z13 + z2;
  d3 = z13 - z2;
  d1 = z11 + z4;
  d7 = z11 - z4;
  return [d0, d1, d2, d3, d4, d5, d6, d7];
}

function jo_writeBits(fp: number, bitBuf: int32, bitCnt: int32, bs: uint16[], debug: boolean = false): [int32, int32] {
  bitCnt += int32(bs[1]);
  bitBuf |= int32(bs[0]) << (24 - bitCnt);
  while (bitCnt >= 8) {
    var c: uint8 = uint8((bitBuf >> 16) & 255);
    if (debug) {
      process.stdout.write(' ' + int32(c));
    }
    fs.writeSync(fp, new Int8Array([int32(c)]));
    if (int32(c) == 255) {
      if (debug) {
        process.stdout.write(' 0');
      }
      fs.writeSync(fp, new Int8Array([0]));
    }
    bitBuf <<= 8;
    bitCnt -= 8;
  }
  return [bitBuf, bitCnt];
}

export function jo_calcBits(val: int32, bits: uint16[]) {
  var tmp1: int32 = val < 0 ? -val : val;
  val = val < 0 ? val - 1 : val;
  bits[1] = 1;
  while (tmp1 >>= 1) {
    ++bits[1];
  }
  bits[0] = uint16(val & ((1 << int32(bits[1])) - 1));
}

function jo_processDU(fp: number, bitBuf: int32, bitCnt: int32, CDU: int32[], du_stride: int32, fdtbl: int32[], DC: int32, HTDC: uint16[][], HTAC: uint16[][], debug: boolean): [int32, int32, int32] {
  var EOB: uint16[] = [HTAC[0][0], HTAC[0][1]];
  var M16zeroes: uint16[] = [HTAC[240][0], HTAC[240][1]];
  for (var i: int32 = 0; i < du_stride*8; i += du_stride) {
    [CDU[i], CDU[i + 1], CDU[i + 2], CDU[i + 3], CDU[i + 4], CDU[i + 5], CDU[i + 6], CDU[i + 7]] = jo_DCT(CDU[i], CDU[i + 1], CDU[i + 2], CDU[i + 3], CDU[i + 4], CDU[i + 5], CDU[i + 6], CDU[i + 7]);
  }
  for (var i: int32 = 0; i < 8; ++i) {
    [CDU[i], CDU[i + du_stride], CDU[i + du_stride*2], CDU[i + du_stride*3], CDU[i + du_stride*4], CDU[i + du_stride*5], CDU[i + du_stride*6], CDU[i + du_stride*7]] = jo_DCT(CDU[i], CDU[i + du_stride], CDU[i + du_stride*2], CDU[i + du_stride*3], CDU[i + du_stride*4], CDU[i + du_stride*5], CDU[i + du_stride*6], CDU[i + du_stride*7]);
  }
  var DU = Array<int32>(64);
  for (var y: int32 = 0, j: int32 = 0; y < 8; ++y) {
    for (var x: int32 = 0; x < 8; ++x , ++j) {
      var i: int32 = y*du_stride + x;
      if (debug) {
        process.stdout.write(' ' + CDU[i]);
      }
      var v: int32 = CDU[i];
      if (v < 0)
        v -= FX_ROUND;
      else
        v += FX_ROUND;
      DU[s_jo_ZigZag[j]] = v / fdtbl[j];
    }
  }
  if (debug) {
    process.stdout.write('\n');
  }
  if (debug) {
    for (var i: int32 = 0; i < 64; ++i) {
      process.stdout.write(' ' + DU[i]);
    }
    process.stdout.write('\n');
  }
  var diff: int32 = DU[0] - DC;
  if (diff == 0) {
    [bitBuf, bitCnt] = jo_writeBits(fp, bitBuf, bitCnt, HTDC[0], debug);
  } else {
    var bits = Array<uint16>(2);
    jo_calcBits(diff, bits);
    [bitBuf, bitCnt] = jo_writeBits(fp, bitBuf, bitCnt, HTDC[bits[1]], debug);
    [bitBuf, bitCnt] = jo_writeBits(fp, bitBuf, bitCnt, bits, debug);
  }
  var end0pos: int32 = 63;
  for (; (end0pos > 0) && (DU[end0pos] == 0); --end0pos) {
  }
  if (end0pos == 0) {
    [bitBuf, bitCnt] = jo_writeBits(fp, bitBuf, bitCnt, EOB, debug);
    return [DU[0], bitBuf, bitCnt];
  }
  for (var i: int32 = 1; i <= end0pos; ++i) {
    var startpos: int32 = i;
    for (; DU[i] == 0 && i <= end0pos; ++i) {
    }
    var nrzeroes: int32 = i - startpos;
    if (nrzeroes >= 16) {
      var lng: int32 = nrzeroes >> 4;
      for (var nrmarker: int32 = 1; nrmarker <= lng; ++nrmarker) {
        [bitBuf, bitCnt] = jo_writeBits(fp, bitBuf, bitCnt, M16zeroes, debug);
      }
      nrzeroes &= 15;
    }
    var bits = Array<uint16>(2);
    jo_calcBits(DU[i], bits);
    [bitBuf, bitCnt] = jo_writeBits(fp, bitBuf, bitCnt, HTAC[(nrzeroes << 4) + int32(bits[1])], debug);
    [bitBuf, bitCnt] = jo_writeBits(fp, bitBuf, bitCnt, bits, debug);
  }
  if (end0pos != 63) {
    [bitBuf, bitCnt] = jo_writeBits(fp, bitBuf, bitCnt, EOB, debug);
  }
  if (debug) {
    process.stdout.write('\n');
  }
  return [DU[0], bitBuf, bitCnt];
}

export function fx_write_jpg(filename: string, data: Buffer, width: int32, height: int32, comp: int32, quality: int32, subsample: int32): boolean {
  const std_dc_luminance_nrcodes: uint8[] = [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
  const std_dc_luminance_values: uint8[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const std_ac_luminance_nrcodes: uint8[] = [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 125];
  const std_ac_luminance_values: uint8[] = [1, 2, 3, 0, 4, 17, 5, 18, 33, 49, 65, 6, 19, 81, 97, 7, 34, 113, 20, 50, 129, 145, 161, 8, 35, 66, 177, 193, 21, 82, 209, 240, 36, 51, 98, 114, 130, 9, 10, 22, 23, 24, 25, 26, 37, 38, 39, 40, 41, 42, 52, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215, 216, 217, 218, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250];
  const std_dc_chrominance_nrcodes: uint8[] = [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
  const std_dc_chrominance_values: uint8[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const std_ac_chrominance_nrcodes: uint8[] = [0, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 119];
  const std_ac_chrominance_values: uint8[] = [0, 1, 2, 3, 17, 4, 5, 33, 49, 6, 18, 65, 81, 7, 97, 113, 19, 34, 50, 129, 8, 20, 66, 145, 161, 177, 193, 9, 35, 51, 82, 240, 21, 98, 114, 209, 10, 22, 36, 52, 225, 37, 241, 23, 24, 25, 26, 38, 39, 40, 41, 42, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 130, 131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215, 216, 217, 218, 226, 227, 228, 229, 230, 231, 232, 233, 234, 242, 243, 244, 245, 246, 247, 248, 249, 250];
  const YDC_HT: uint16[][] = [[0, 2], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [14, 4], [30, 5], [62, 6], [126, 7], [254, 8], [510, 9]];
  const UVDC_HT: uint16[][] = [[0, 2], [1, 2], [2, 2], [6, 3], [14, 4], [30, 5], [62, 6], [126, 7], [254, 8], [510, 9], [1022, 10], [2046, 11]];
  const YAC_HT: uint16[][] = [[10, 4], [0, 2], [1, 2], [4, 3], [11, 4], [26, 5], [120, 7], [248, 8], [1014, 10], [65410, 16], [65411, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [12, 4], [27, 5], [121, 7], [502, 9], [2038, 11], [65412, 16], [65413, 16], [65414, 16], [65415, 16], [65416, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [28, 5], [249, 8], [1015, 10], [4084, 12], [65417, 16], [65418, 16], [65419, 16], [65420, 16], [65421, 16], [65422, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [58, 6], [503, 9], [4085, 12], [65423, 16], [65424, 16], [65425, 16], [65426, 16], [65427, 16], [65428, 16], [65429, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [59, 6], [1016, 10], [65430, 16], [65431, 16], [65432, 16], [65433, 16], [65434, 16], [65435, 16], [65436, 16], [65437, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [122, 7], [2039, 11], [65438, 16], [65439, 16], [65440, 16], [65441, 16], [65442, 16], [65443, 16], [65444, 16], [65445, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [123, 7], [4086, 12], [65446, 16], [65447, 16], [65448, 16], [65449, 16], [65450, 16], [65451, 16], [65452, 16], [65453, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [250, 8], [4087, 12], [65454, 16], [65455, 16], [65456, 16], [65457, 16], [65458, 16], [65459, 16], [65460, 16], [65461, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [504, 9], [32704, 15], [65462, 16], [65463, 16], [65464, 16], [65465, 16], [65466, 16], [65467, 16], [65468, 16], [65469, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [505, 9], [65470, 16], [65471, 16], [65472, 16], [65473, 16], [65474, 16], [65475, 16], [65476, 16], [65477, 16], [65478, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [506, 9], [65479, 16], [65480, 16], [65481, 16], [65482, 16], [65483, 16], [65484, 16], [65485, 16], [65486, 16], [65487, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [1017, 10], [65488, 16], [65489, 16], [65490, 16], [65491, 16], [65492, 16], [65493, 16], [65494, 16], [65495, 16], [65496, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [1018, 10], [65497, 16], [65498, 16], [65499, 16], [65500, 16], [65501, 16], [65502, 16], [65503, 16], [65504, 16], [65505, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [2040, 11], [65506, 16], [65507, 16], [65508, 16], [65509, 16], [65510, 16], [65511, 16], [65512, 16], [65513, 16], [65514, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [65515, 16], [65516, 16], [65517, 16], [65518, 16], [65519, 16], [65520, 16], [65521, 16], [65522, 16], [65523, 16], [65524, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [2041, 11], [65525, 16], [65526, 16], [65527, 16], [65528, 16], [65529, 16], [65530, 16], [65531, 16], [65532, 16], [65533, 16], [65534, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
  const UVAC_HT: uint16[][] = [[0, 2], [1, 2], [4, 3], [10, 4], [24, 5], [25, 5], [56, 6], [120, 7], [500, 9], [1014, 10], [4084, 12], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [11, 4], [57, 6], [246, 8], [501, 9], [2038, 11], [4085, 12], [65416, 16], [65417, 16], [65418, 16], [65419, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [26, 5], [247, 8], [1015, 10], [4086, 12], [32706, 15], [65420, 16], [65421, 16], [65422, 16], [65423, 16], [65424, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [27, 5], [248, 8], [1016, 10], [4087, 12], [65425, 16], [65426, 16], [65427, 16], [65428, 16], [65429, 16], [65430, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [58, 6], [502, 9], [65431, 16], [65432, 16], [65433, 16], [65434, 16], [65435, 16], [65436, 16], [65437, 16], [65438, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [59, 6], [1017, 10], [65439, 16], [65440, 16], [65441, 16], [65442, 16], [65443, 16], [65444, 16], [65445, 16], [65446, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [121, 7], [2039, 11], [65447, 16], [65448, 16], [65449, 16], [65450, 16], [65451, 16], [65452, 16], [65453, 16], [65454, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [122, 7], [2040, 11], [65455, 16], [65456, 16], [65457, 16], [65458, 16], [65459, 16], [65460, 16], [65461, 16], [65462, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [249, 8], [65463, 16], [65464, 16], [65465, 16], [65466, 16], [65467, 16], [65468, 16], [65469, 16], [65470, 16], [65471, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [503, 9], [65472, 16], [65473, 16], [65474, 16], [65475, 16], [65476, 16], [65477, 16], [65478, 16], [65479, 16], [65480, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [504, 9], [65481, 16], [65482, 16], [65483, 16], [65484, 16], [65485, 16], [65486, 16], [65487, 16], [65488, 16], [65489, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [505, 9], [65490, 16], [65491, 16], [65492, 16], [65493, 16], [65494, 16], [65495, 16], [65496, 16], [65497, 16], [65498, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [506, 9], [65499, 16], [65500, 16], [65501, 16], [65502, 16], [65503, 16], [65504, 16], [65505, 16], [65506, 16], [65507, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [2041, 11], [65508, 16], [65509, 16], [65510, 16], [65511, 16], [65512, 16], [65513, 16], [65514, 16], [65515, 16], [65516, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [16352, 14], [65517, 16], [65518, 16], [65519, 16], [65520, 16], [65521, 16], [65522, 16], [65523, 16], [65524, 16], [65525, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [1018, 10], [32707, 15], [65526, 16], [65527, 16], [65528, 16], [65529, 16], [65530, 16], [65531, 16], [65532, 16], [65533, 16], [65534, 16], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
  const YQT: int32[] = [16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16, 24, 40, 57, 69, 56, 14, 17, 22, 29, 51, 87, 80, 62, 18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113, 92, 49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99];
  const UVQT: int32[] = [17, 18, 24, 47, 99, 99, 99, 99, 18, 21, 26, 66, 99, 99, 99, 99, 24, 26, 56, 99, 99, 99, 99, 99, 47, 66, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99];
  //var aasf: float32[] = [1.0*2.828427125, 1.387039845*2.828427125, 1.306562965*2.828427125, 1.175875602*2.828427125, 1.0*2.828427125, 0.785694958*2.828427125, 0.541196100*2.828427125, 0.275899379*2.828427125];
  // Fixed point 7 bit fraction
  const aasf_fx: int32[] = [ 362, 502, 473, 426, 362, 284, 196, 100 ];  
 
  if (!(data!=null) || !(filename!=null) || !width || !height || comp > 4 || comp < 1 || comp == 2) {
    return false;
  }
  var fp: number = fs.openSync(filename, 'w');
  if (!(fp!=null)) {
    return false;
  }
  quality = quality ? quality : 90;
  quality = quality < 1 ? 1 : quality > 100 ? 100 : quality;
  quality = quality < 50 ? 5000 / quality : 200 - quality*2;
  var YTable = Array<uint8>(64);
  var UVTable = Array<uint8>(64);
  for (var i: int32 = 0; i < 64; ++i) {
    var yti: int32 = (YQT[i]*quality + 50) / 100;
    YTable[s_jo_ZigZag[i]] = uint8(yti < 1 ? 1 : yti > 255 ? 255 : yti);
    var uvti: int32 = (UVQT[i]*quality + 50) / 100;
    UVTable[s_jo_ZigZag[i]] = uint8(uvti < 1 ? 1 : uvti > 255 ? 255 : uvti);
  }
  var fdtbl_Y = Array<int32>(64);
  var fdtbl_UV = Array<int32>(64);
  for (var row: int32 = 0, k: int32 = 0; row < 8; ++row) {
    for (var col: int32 = 0; col < 8; ++col , ++k) {
      fdtbl_Y[k] = YTable[s_jo_ZigZag[k]] * aasf_fx[row] * aasf_fx[col] * 2; // max 972
      fdtbl_UV[k] = UVTable[s_jo_ZigZag[k]] * aasf_fx[row] * aasf_fx[col] * 2; // 796      
    }
  }

  var head0: uint8[] = [255, 216, 255, 224, 0, 16, 74, 70, 73, 70, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 255, 219, 0, 132, 0];
  fs.writeSync(fp, new Uint8Array(head0), 0, (25)*1 );
  fs.writeSync(fp, new Uint8Array(YTable), 0, (64)*1 );
  fs.writeSync(fp, new Int8Array([1]));
  fs.writeSync(fp, new Uint8Array(UVTable), 0, (64)*1 );
  var head1: uint8[] = [255, 192, 0, 17, 8, uint8((height >> 8)), uint8((height & 255)), uint8((width >> 8)), uint8((width & 255)), 3, 1, uint8((subsample ? 34 : 17)), 0, 2, 17, 1, 3, 17, 1, 255, 196, 1, 162, 0];
  fs.writeSync(fp, new Uint8Array(head1), 0, (24)*1 );
  fs.writeSync(fp, new Uint8Array(std_dc_luminance_nrcodes.slice(1)), 0, (16)*1 );
  fs.writeSync(fp, new Uint8Array(std_dc_luminance_values), 0, (12)*1 );
  fs.writeSync(fp, new Int8Array([16]));
  fs.writeSync(fp, new Uint8Array(std_ac_luminance_nrcodes.slice(1)), 0, (16)*1 );
  fs.writeSync(fp, new Uint8Array(std_ac_luminance_values), 0, (162)*1 );
  fs.writeSync(fp, new Int8Array([1]));
  fs.writeSync(fp, new Uint8Array(std_dc_chrominance_nrcodes.slice(1)), 0, (16)*1 );
  fs.writeSync(fp, new Uint8Array(std_dc_chrominance_values), 0, (12)*1 );
  fs.writeSync(fp, new Int8Array([17]));
  fs.writeSync(fp, new Uint8Array(std_ac_chrominance_nrcodes.slice(1)), 0, (16)*1 );
  fs.writeSync(fp, new Uint8Array(std_ac_chrominance_values), 0, (162)*1 );
  var head2: uint8[] = [255, 218, 0, 12, 3, 1, 0, 2, 17, 3, 17, 0, 63, 0];
  fs.writeSync(fp, new Uint8Array(head2), 0, (14)*1 );
  var ofsG: int32 = comp > 1 ? 1 : 0;
  var ofsB: int32 = comp > 1 ? 2 : 0;
  var dataR = new Uint8Array(data.buffer, data.byteOffset, data.length / Uint8Array.BYTES_PER_ELEMENT);
  var _ptr_dataR: uint32 = 0;
  var dataG = dataR;
  var _ptr_dataG: uint32 = uint32(0 + ofsG);
  var dataB = dataR;
  var _ptr_dataB: uint32 = uint32(0 + ofsB);
  var DCY: int32 = 0;
  var DCU: int32 = 0;
  var DCV: int32 = 0;
  var bitBuf: int32 = 0;
  var bitCnt: int32 = 0;  

  const poly: int32[] = [
    9798, 19235, 3735, -128 * FX_K,
    -5529, -10855, 16384, 0,
    16384, -13720, -2664, 0
  ];
  for (var y: int32 = 0; y < height; y += 8) {
    for (var x: int32 = 0; x < width; x += 8) {
      var Y = Array<int32>(64);
      var U = Array<int32>(64);
      var V = Array<int32>(64);
      for (var row: int32 = y, pos: int32 = 0; row < y + 8; ++row) {
        for (var col: int32 = x; col < x + 8; ++col , ++pos) {
          var prow: int32 = row >= height ? height - 1 : row;
          var pcol: int32 = col >= width ? width - 1 : col;
          var p: int32 = prow*width*comp + pcol*comp;
          var r: int32 = int32(dataR[_ptr_dataR + p]);
          var g: int32 = int32(dataG[_ptr_dataG + p]);
          var b: int32 = int32(dataB[_ptr_dataB + p]);
          Y[pos] = poly[0] * r + poly[1] * g + poly[2] * b + poly[3];
          U[pos] = poly[4] * r + poly[5] * g + poly[6] * b + poly[7];
          V[pos] = poly[8] * r + poly[9] * g + poly[10] * b + poly[11];
        }
      }
      [DCY, bitBuf, bitCnt] = jo_processDU(fp, bitBuf, bitCnt, Y, 8, fdtbl_Y, DCY, YDC_HT, YAC_HT, y == 0 && x == 0);
      [DCU, bitBuf, bitCnt] = jo_processDU(fp, bitBuf, bitCnt, U, 8, fdtbl_UV, DCU, UVDC_HT, UVAC_HT, y == 0 && x == 0);
      [DCV, bitBuf, bitCnt] = jo_processDU(fp, bitBuf, bitCnt, V, 8, fdtbl_UV, DCV, UVDC_HT, UVAC_HT, y == 0 && x == 0);
    }
  }

  var fillBits: uint16[] = [127, 7];
  [bitBuf, bitCnt] = jo_writeBits(fp, bitBuf, bitCnt, fillBits, false);
  fs.writeSync(fp, new Int8Array([255]));
  fs.writeSync(fp, new Int8Array([217]));
  fs.closeSync(fp);
  return true;  
}
