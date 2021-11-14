export const b64ToUint6 = (char) => {
    const nChr = char.charCodeAt(0);
    if(nChr > 64 && nChr < 91) {
        return nChr - 65;
    } else if (nChr > 96 && nChr < 123 ) {
        return nChr - 71;
    } else if (nChr > 47 && nChr < 58 ) {
        return nChr + 4;
    } else if (nChr === 43 ) {
        return 62;
    } else if (nChr === 47 ) {
        return 63;
    }
    return 65;
};

export const uint6ToB64 = (nUint6) => {
    let charCode = 65;
    if(nUint6 < 26) {
        charCode = nUint6 + 65;
    } else if (nUint6 < 52) {
        charCode = nUint6 + 71;
    } else if (nUint6 < 62) {
        charCode = nUint6 - 4;
    } else if (nUint6 === 62) {
        charCode = 43;
    } else if (nUint6 === 63) {
        charCode = 47;
    }
    return String.fromCharCode(charCode);
};

const bit6ToB64 = (bit6String) =>
    bit6String.split('').reduce((acc, bit, idx) => acc + (bit << (5-idx)), 0);

const nToChar = (n) => String.fromCharCode(n + 58);
const charToN = (char) => char.charCodeAt(0) - 58;

export function packIsdst(intArray = []) {
    const twoStateArray = intArray.map((isdst) => isdst <= 0 ? 0 : 1);
    const bit6Chunks = twoStateArray.join('').match(/.{1,6}/g);
    return  bit6Chunks.reduce((acc, bit6Chunk) => {
        const nChar = bit6Chunk.length === 6 ? '' : nToChar(bit6Chunk.length);
        const uint6 = bit6ToB64(bit6Chunk.padEnd(6, '0'));
        return `${acc}${nChar}${uint6ToB64(uint6)}`;
    }, '');
}

const masks = [
    parseInt('100000', 2),
    parseInt('010000', 2),
    parseInt('001000', 2),
    parseInt('000100', 2),
    parseInt('000010', 2),
    parseInt('000001', 2),
];

const uInt6ToBits = (uInt6, n) => {
    const bits = [];
    for (let j = 0; j < n; j += 1) {
        bits.push(uInt6 & masks[j] ? 1 : 0);
    }
    return bits;
};

export function unPackIsdst(packedBase64) {
    const chars = packedBase64.split('');
    const unPacked = chars.reduce((acc, b64) => {
        const uInt6 = b64ToUint6(b64);
        return (uInt6 > 64) ?
            {
                isdst: acc.isdst,
                n: charToN(b64),
            } :
            {
                isdst: acc.isdst.concat(uInt6ToBits(uInt6, acc.n)),
                n: 6,
            };
    }, { isdst: [], n: 6 });
    return unPacked.isdst;
}
