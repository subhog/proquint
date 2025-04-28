import { makeId, checkId, toRand } from '../src/index';

describe('proquint', () => {
  describe('makeId', () => {
    it('should generate a valid proquint ID', () => {
      const id = makeId();
      expect(id).toMatch(/^[bdfghjklmnprstvz][aiou][bdfghjklmnprstvz][aiou][bdfghjklmnprstvz]-[bdfghjklmnprstvz][aiou][bdfghjklmnprstvz][aiou][bdfghjklmnprstvz]-[0123456789abcdghijklmnopqrstuvwz]{20}$/);
      expect(checkId(id)).toBe(0);
    });

    it('should generate different IDs on each call', () => {
      const id1 = makeId();
      const id2 = makeId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('checkId', () => {
    it('should return 0 for valid IDs', () => {
      const id = makeId();
      expect(checkId(id)).toBe(0);
    });

    it('should not return 0 for invalid IDs', () => {
      expect(checkId('invalid-id')).toBe(-1);
      expect(checkId('babab-babab-0000000000000000000')).not.toBe(0); // Too short
      expect(checkId('babab-babab-00000000000000000001')).not.toBe(0); // Wrong checksum
      expect(checkId('babab-babab-000000000000000000000')).not.toBe(0); // Too long
    });
  });

  describe('toRand', () => {
    it('should return a number between 0 and 1', () => {
      const id = makeId();
      const rand = toRand(id);
      expect(rand).toBeGreaterThanOrEqual(0);
      expect(rand).toBeLessThan(1);
    });
  });
});
