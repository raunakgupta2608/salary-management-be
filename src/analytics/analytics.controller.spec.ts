import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let service: AnalyticsService;

  const mockAnalyticsService = {
    getSalarySummaryByCountry: jest.fn(),
    getAverageSalaryByJobTitle: jest.fn(),
    getHeadcountByCountryAndJobTitle: jest.fn(),
    getSalaryOutliers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    service = module.get<AnalyticsService>(AnalyticsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCountrySalarySummary', () => {
    it('should return country salary summary', () => {
      const expectedResult = [
        {
          country: 'USA',
          min_salary: '50000.00',
          max_salary: '150000.00',
          avg_salary: '100000.00',
        },
      ];

      mockAnalyticsService.getSalarySummaryByCountry.mockReturnValue(
        expectedResult,
      );

      const result = controller.getCountrySalarySummary();

      expect(result).toEqual(expectedResult);
      expect(service.getSalarySummaryByCountry).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAverageSalaryByJobTitle', () => {
    it('should return average salary by job title without country filter', () => {
      const expectedResult = [
        { job_title: 'Engineer', avg_salary: '100000.00' },
      ];

      mockAnalyticsService.getAverageSalaryByJobTitle.mockReturnValue(
        expectedResult,
      );

      const result = controller.getAverageSalaryByJobTitle();

      expect(result).toEqual(expectedResult);
      expect(service.getAverageSalaryByJobTitle).toHaveBeenCalledWith(
        undefined,
      );
    });

    it('should return average salary by job title with country filter', () => {
      const expectedResult = [
        { job_title: 'Engineer', avg_salary: '95000.00' },
      ];

      mockAnalyticsService.getAverageSalaryByJobTitle.mockReturnValue(
        expectedResult,
      );

      const result = controller.getAverageSalaryByJobTitle('USA');

      expect(result).toEqual(expectedResult);
      expect(service.getAverageSalaryByJobTitle).toHaveBeenCalledWith('USA');
    });
  });

  describe('getHeadcountByCountryAndJobTitle', () => {
    it('should return headcount by country and job title', () => {
      const expectedResult = [
        { country: 'USA', job_title: 'Engineer', headcount: 50 },
      ];

      mockAnalyticsService.getHeadcountByCountryAndJobTitle.mockReturnValue(
        expectedResult,
      );

      const result = controller.getHeadcountByCountryAndJobTitle();

      expect(result).toEqual(expectedResult);
      expect(service.getHeadcountByCountryAndJobTitle).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSalaryOutliers', () => {
    it('should return salary outliers', () => {
      const expectedResult = [
        {
          id: 1,
          full_name: 'John Doe',
          job_title: 'CEO',
          country: 'USA',
          salary: '500000.00',
        },
      ];

      mockAnalyticsService.getSalaryOutliers.mockReturnValue(expectedResult);

      const result = controller.getSalaryOutliers();

      expect(result).toEqual(expectedResult);
      expect(service.getSalaryOutliers).toHaveBeenCalledTimes(1);
    });
  });
});
