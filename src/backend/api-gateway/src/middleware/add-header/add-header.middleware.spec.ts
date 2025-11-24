import { AddHeaderMiddleware } from './add-header.middleware';

describe('AddHeaderMiddleware', () => {
  it('should be defined', () => {
    expect(new AddHeaderMiddleware()).toBeDefined();
  });
});
