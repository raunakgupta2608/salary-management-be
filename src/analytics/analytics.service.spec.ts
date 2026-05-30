import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { AnalyticsRepository } from './analytics.repository';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let repository: AnalyticsRepository;

  const mockAnalyticsRepository = {
    getSalarySummaryByCountry: jest.fn(),
    getAverageSalaryByJobTitle: jest.fn(),
    getHeadcountByCountryAndJobTitle: jest.fn(),
    getSalaryOutliers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: AnalyticsRepository,
          useValue: mockAnalyticsRepository,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    repository = module.get<AnalyticsRepository>(AnalyticsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSalarySummaryByCountry', () => {
    it('should return salary summary by country', async () => {
      const expectedResult = [
        {
          country: 'USA',
          min_salary: '50000.00',
          max_salary: '150000.00',
          avg_salary: '100000.00',
        },
        {
          country: 'UK',
          min_salary: '45000.00',
          max_salary: '140000.00',
          avg_salary: '95000.00',
        },
      ];

      mockAnalyticsRepository.getSalarySummaryByCountry.mockResolvedValue(
        expectedResult,
      );

      const result = await service.getSalarySummaryByCountry();

      expect(result).toEqual(expectedResult);
      expect(repository.getSalarySummaryByCountry).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAverageSalaryByJobTitle', () => {
    it('should return average salary by job title without country filter', async () => {
      const expectedResult = [
        { job_title: 'Engineer', avg_salary: '100000.00' },
        { job_title: 'Manager', avg_salary: '120000.00' },
      ];

      mockAnalyticsRepository.getAverageSalaryByJobTitle.mockResolvedValue(
        expectedResult,
      );

      const result = await service.getAverageSalaryByJobTitle();

      expect(result).toEqual(expectedResult);
      expect(repository.getAverageSalaryByJobTitle).toHaveBeenCalledWith(
        undefined,
      );
    });

    it('should return average salary by job title with country filter', async () => {
      const expectedResult = [
        { job_title: 'Engineer', avg_salary: '95000.00' },
      ];

      mockAnalyticsRepository.getAverageSalaryByJobTitle.mockResolvedValue(
        expectedResult,
      );

      const result = await service.getAverageSalaryByJobTitle('USA');

      expect(result).toEqual(expectedResult);
      expect(repository.getAverageSalaryByJobTitle).toHaveBeenCalledWith('USA');
    });
  });

  describe('getHeadcountByCountryAndJobTitle', () => {
    it('should return headcount grouped by country and job title', async () => {
      const expectedResult = [
        { country: 'USA', job_title: 'Engineer', headcount: 50 },
        { country: 'USA', job_title: 'Manager', headcount: 20 },
        { country: 'UK', job_title: 'Engineer', headcount: 30 },
      ];

      mockAnalyticsRepository.getHeadcountByCountryAndJobTitle.mockResolvedValue(
        expectedResult,
      );

      const result = await service.getHeadcountByCountryAndJobTitle();

      expect(result).toEqual(expectedResult);
      expect(repository.getHeadcountByCountryAndJobTitle).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  describe('getSalaryOutliers', () => {
    it('should return salary outliers', async () => {
      const expectedResult = [
        {
          id: 1,
          full_name: 'John Doe',
          job_title: 'CEO',
          country: 'USA',
          salary: '500000.00',
        },
        {
          id: 2,
          full_name: 'Jane Smith',
          job_title: 'Intern',
          country: 'USA',
          salary: '15000.00',
        },
      ];

      mockAnalyticsRepository.getSalaryOutliers.mockResolvedValue(
        expectedResult,
      );

      const result = await service.getSalaryOutliers();

      expect(result).toEqual(expectedResult);
      expect(repository.getSalaryOutliers).toHaveBeenCalledTimes(1);
    });
  });
});
