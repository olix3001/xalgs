import { Test, TestingModule } from '@nestjs/testing';
import { TaskQueueService } from './task-queue.service';

describe('TaskQueueService', () => {
  let service: TaskQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskQueueService],
    }).compile();

    service = module.get<TaskQueueService>(TaskQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
