import { NumberSignPipe } from './number-sign.pipe';

describe('NumberSignPipe', () => {
  it('create an instance', () => {
    const pipe = new NumberSignPipe();
    expect(pipe).toBeTruthy();
  });

  it('shold add "+" to positive number', () => {
    const pipe = new NumberSignPipe();
    const numb = 2;
    expect(pipe.transform(numb)).toBe('+' + numb.toString());
  });

  it('should add "-" to negative number', () => {
    const pipe = new NumberSignPipe();
    const numb = -2;
    expect(pipe.transform(numb)).toBe(numb.toString());
  });

  it('should output "0" on zero input', () => {
    const pipe = new NumberSignPipe();
    const numb = 0;
    expect(pipe.transform(numb)).toBe('0');
  });

  it('should not modify string literals', () => {
    const pipe = new NumberSignPipe();
    const str = '2';
    expect(pipe.transform(str)).toBe(str);
  });

  it('should not modify other objects', () => {
    const pipe = new NumberSignPipe();
    const str = { data: '2' };
    expect(pipe.transform(str)).toEqual(str);
  });
});
