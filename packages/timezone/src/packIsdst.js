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
    return 0;
};

export const uint6ToB64 = (nUint6) => {
    let char = 65;
    if(nUint6 < 26) {
        char = nUint6 + 65;
    } else if (nUint6 < 52) {
        char = nUint6 + 71;
    } else if (nUint6 < 62) {
        char = nUint6 - 4;
    } else if (nUint6 === 62) {
        char = 43;
    } else if (nUint6 === 63) {
        char = 47;
    }
    return String.fromCharCode(char);
};


export function packIsdst(intArray = []) {
    const threeStateArray = intArray.map((isdst) => Math.sign(isdst) + 1);
    const numberOfBytes = Math.ceil(threeStateArray.length / 3);
    let packed = '';
    for (let i = 0; i < numberOfBytes; i += 1) {
        const idx = i * 3;
        let uInt6 = 0;
        for (let j = 0; j < 3; j += 1) {
            const v = threeStateArray[idx + j];
            const vm = v == null ? 3 : v;
            const vs = vm << ((2-j) * 2);
            uInt6 += vs;
        }
        packed += uint6ToB64(uInt6);
    }
    return packed;
}

const masks = [
    parseInt('110000', 2),
    parseInt('001100', 2),
    parseInt('000011', 2),
];

export function unPackIsdst(packedBas64) {
    const u6 = packedBas64
        .split('')
        .map(b64ToUint6);
    const threeStateArray = [];
    for (const uInt6 of u6) {
        for (let j = 0; j < 3; j += 1) {
            const vs = uInt6 & masks[j];
            const isdst = vs >> ((2-j)*2);
            if (isdst !== 3) {
                threeStateArray.push(isdst);
            }
        }
    }
    return threeStateArray.map((isdst) => isdst - 1);
}
