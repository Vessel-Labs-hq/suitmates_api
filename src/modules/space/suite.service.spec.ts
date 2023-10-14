import { Test, TestingModule } from '@nestjs/testing';
import { SuiteService } from './space.service';

describe('SuiteService', () => {
  let service: SuiteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuiteService],
    }).compile();

    service = module.get<SuiteService>(SuiteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
