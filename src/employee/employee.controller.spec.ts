import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let service: EmployeeService;

  const mockEmployeeService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        {
          provide: EmployeeService,
          useValue: mockEmployeeService,
        },
      ],
    }).compile();

    controller = module.get<EmployeeController>(EmployeeController);
    service = module.get<EmployeeService>(EmployeeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return employees with default limit', async () => {
      const result = {
        data: [{ id: 1, name: 'John Doe' }],
        nextCursor: null,
      };

      mockEmployeeService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);

      expect(service.findAll).toHaveBeenCalledWith(undefined, 20);
    });

    it('should pass cursor and limit correctly', async () => {
      const result = {
        data: [{ id: 2, name: 'Jane Doe' }],
        nextCursor: 3,
      };

      mockEmployeeService.findAll.mockResolvedValue(result);

      expect(await controller.findAll('1', '10')).toEqual(result);

      expect(service.findAll).toHaveBeenCalledWith(1, 10);
    });

    it('should handle undefined cursor', async () => {
      const result = {
        data: [],
        nextCursor: null,
      };

      mockEmployeeService.findAll.mockResolvedValue(result);

      await controller.findAll(undefined, '5');

      expect(service.findAll).toHaveBeenCalledWith(undefined, 5);
    });
  });
});
