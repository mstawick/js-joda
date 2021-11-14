import { expect } from 'chai';
import isdst2021e from './fixtures/2021e-isdst.json';
import { packIsdst, unPackIsdst, b64ToUint6, uint6ToB64 } from '../src/packIsdst';

describe('packIsdst', () => {

    describe('base64', () => {
        it('should encode / decode all int6 in rang', () => {
            for (let i = 0; i < 64; i += 1) {
                const char = uint6ToB64(i);
                const int6 = b64ToUint6(char);
                expect(i).to.eql(int6);
            }
        });
    });

    describe('pack/ unpack', () => {

        it('should pack and unpack int array containing -1, 0 or 1', () => {
            const isdstFixtures = [
                { in: [-1, 0, 1], out: [0, 0, 1] },
                { in: [-2, 0, 2], out: [0, 0, 1] },
                { in: [0, 0, 1, 1] },
                { in: [1, 0, 0, 1, 1] },
                { in: [0, 1, 0, 1, 0, 1] },
                { in: [0, 1, 0, 1, 1, 0] },
                { in: [1, 1, 0, 1, 0, 0, 1] },
                { in: [0, 1, 1, 0, 1, 0, 0, 1] },
                { in: [0, 1, 1, 0, 1, 0, 0, 1] },
                { in: [0, 1, 1, 0, 1, 0, 0, 0] },
                { in: [0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0] },
                { in: [1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0] },
            ];

            for (const fixture of isdstFixtures) {
                const packed = packIsdst(fixture.in);
                const unPacked = unPackIsdst(packed);
                expect(unPacked).to.eql(fixture.out || fixture.in);
            }
        });

        it('should pack and unpack all isdst in 2021e', () => {
            const isdstFixtures = isdst2021e.map((z)=> z.isdst.split('').map(c => c/1));
            let pl = 0;
            let upl = 0;
            for (const isdst of isdstFixtures) {
                const packed = packIsdst(isdst);
                const unPacked = unPackIsdst(packed);
                upl += unPacked.length;
                pl += packed.length ;
                expect(unPacked).to.eql(isdst);
            }
            console.log(`packed / unpacked ratio is ${pl / upl}`);
        });
    });
});
