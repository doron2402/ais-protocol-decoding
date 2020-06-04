// @ts-nocheck
import * as test from "tape";

import { parseIntFromBuffer,
  parseStringFromBuffer } from '../../lib/bitsHelper';

test("bitsHelper.parseIntFromBuffer", (t) => {
  t.equal(parseIntFromBuffer([], 1, 2), undefined);
  t.equal(parseIntFromBuffer([1,2,2,2,2,2], 1, 5), 1);
  t.end();
});


test('bitsHelper.parseStringFromBuffer', (t) => {
  t.equal(parseStringFromBuffer([1,2,2,2,2,2], 1, 5), 'B');
  t.end();
});
