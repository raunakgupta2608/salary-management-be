import { EmployeeService } from './employee.service';
import { EmployeeRepository } from './employee.repository';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let repo: jest.Mocked<EmployeeRepository>;

  beforeEach(() => {
    repo = {
      findAll: jest.fn(),
    } as any;

    service = new EmployeeService(repo);
  });

  it('should call repository with cursor and limit', async () => {
    const mockResult = {
      data: [{ id: 1 }],
      nextCursor: 1,
      hasMore: false,
    };

    repo.findAll.mockResolvedValue(mockResult);

    const result = await service.findAll(10, 5);

    expect(repo.findAll).toHaveBeenCalledWith(10, 5);
    expect(result).toEqual(mockResult);
  });

  it('should use default limit when not provided', async () => {
    repo.findAll.mockResolvedValue({
      data: [],
      nextCursor: null,
      hasMore: false,
    });

    await service.findAll(undefined, undefined);

    expect(repo.findAll).toHaveBeenCalledWith(undefined, 20);
  });

  it('should forward undefined cursor correctly', async () => {
    repo.findAll.mockResolvedValue({
      data: [],
      nextCursor: null,
      hasMore: false,
    });

    await service.findAll(undefined, 10);

    expect(repo.findAll).toHaveBeenCalledWith(undefined, 10);
  });

  it('should return repository result without modification', async () => {
    const mockResult = {
      data: [{ id: 1 }, { id: 2 }],
      nextCursor: 2,
      hasMore: true,
    };

    repo.findAll.mockResolvedValue(mockResult);

    const result = await service.findAll(1, 2);

    expect(result).toBe(mockResult);
  });
});
