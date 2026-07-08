import { initialsOf } from '../users.helpers';

describe('initialsOf', () => {
  it('takes the first letter of firstName and lastName, uppercased', () => {
    expect(initialsOf('Ohad', 'Daniel')).toBe('OD');
  });

  it('handles single names and messy whitespace', () => {
    expect(initialsOf('alice', '')).toBe('A');
    expect(initialsOf('  alice  ', '  levi  ')).toBe('AL');
  });
});
