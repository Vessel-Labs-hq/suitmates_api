import { Test, TestingModule } from '@nestjs/testing';
import { SuiteController } from './suite.controller';
import { SuiteService } from './suite.service';

describe('SuiteController', () => {
  let controller: SuiteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuiteController],
      providers: [SuiteService],
    }).compile();

    controller = module.get<SuiteController>(SuiteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
