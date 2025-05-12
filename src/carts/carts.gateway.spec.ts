import { Test, TestingModule } from '@nestjs/testing';
import { CartsGateway } from './carts.gateway';

describe('CartsGateway', () => {
  let gateway: CartsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartsGateway],
    }).compile();

    gateway = module.get<CartsGateway>(CartsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
