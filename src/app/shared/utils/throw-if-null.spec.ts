import { throwIfNull } from './throw-if-null';
import { TestScheduler } from 'rxjs/testing';

describe('throwIfNull', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should return data', () => {
    const value = { d: 'data' };
    scheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
      const obs = cold('-d|', value);
      const res = '     -d|';
      const subs = '    ^-!';
      expectObservable(obs.pipe(throwIfNull())).toBe(res, value);
      expectSubscriptions(obs.subscriptions).toBe(subs);
    });
  });

  it('should error on undefined', () => {
    const value = { d: undefined };
    const error = new Error('Not found');
    scheduler.run(({ cold, expectObservable }) => {
      const obs = cold('d|', value);
      const res = '     #';
      expectObservable(obs.pipe(throwIfNull())).toBe(res, value, error);
    });
  });

  it('should error on null', () => {
    const value = { d: null };
    const error = new Error('Not found');
    scheduler.run(({ cold, expectObservable }) => {
      const obs = cold('d|', value);
      const res = '     #';
      expectObservable(obs.pipe(throwIfNull())).toBe(res, value, error);
    });
  });

  it('should display message with parameter', () => {
    const value = { d: null };
    const error = new Error('Not found data');
    scheduler.run(({ cold, expectObservable }) => {
      const obs = cold('d|', value);
      const res = '     #';
      expectObservable(obs.pipe(throwIfNull('data'))).toBe(res, value, error);
    });
  });
});
