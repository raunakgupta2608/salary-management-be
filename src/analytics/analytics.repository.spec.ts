import { AnalyticsRepository } from './analytics.repository';
import { Knex } from 'knex';

describe('AnalyticsRepository', () => {
  let repository: AnalyticsRepository;
  let knexMock: jest.Mock;

  let queryBuilder: any;

  beforeEach(() => {
    queryBuilder = {
      select: jest.fn().mockReturnThis(),
      min: jest.fn().mockReturnThis(),
      max: jest.fn().mockReturnThis(),
      avg: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      count: jest.fn().mockReturnThis(),
      whereRaw: jest.fn().mockReturnThis(),
      orWhereRaw: jest.fn().mockReturnThis(),
    };

    knexMock = jest.fn().mockReturnValue(queryBuilder);

    repository = new AnalyticsRepository(knexMock as unknown as Knex);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSalarySummaryByCountry', () => {
    it('should build salary summary query grouped by country', async () => {
      await repository.getSalarySummaryByCountry();

      expect(knexMock).toHaveBeenCalledWith('employees');

      expect(queryBuilder.select).toHaveBeenCalledWith('country');
      expect(queryBuilder.min).toHaveBeenCalledWith('salary as min_salary');
      expect(queryBuilder.max).toHaveBeenCalledWith('salary as max_salary');
      expect(queryBuilder.avg).toHaveBeenCalledWith('salary as avg_salary');
      expect(queryBuilder.groupBy).toHaveBeenCalledWith('country');
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('country');
    });
  });

  describe('getAverageSalaryByJobTitle', () => {
    it('should build query without country filter', async () => {
      await repository.getAverageSalaryByJobTitle();

      expect(knexMock).toHaveBeenCalledWith('employees');

      expect(queryBuilder.select).toHaveBeenCalledWith('job_title');
      expect(queryBuilder.avg).toHaveBeenCalledWith('salary as avg_salary');
      expect(queryBuilder.groupBy).toHaveBeenCalledWith('job_title');
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('job_title');

      expect(queryBuilder.where).not.toHaveBeenCalled();
    });

    it('should add country filter when country is provided', async () => {
      await repository.getAverageSalaryByJobTitle('India');

      expect(queryBuilder.where).toHaveBeenCalledWith('country', 'India');
    });
  });

  describe('getHeadcountByCountryAndJobTitle', () => {
    it('should build headcount query grouped by country and job title', async () => {
      await repository.getHeadcountByCountryAndJobTitle();

      expect(knexMock).toHaveBeenCalledWith('employees');

      expect(queryBuilder.select).toHaveBeenCalledWith('country', 'job_title');

      expect(queryBuilder.count).toHaveBeenCalledWith('* as headcount');

      expect(queryBuilder.groupBy).toHaveBeenCalledWith('country', 'job_title');

      expect(queryBuilder.orderBy).toHaveBeenNthCalledWith(1, 'country');

      expect(queryBuilder.orderBy).toHaveBeenNthCalledWith(2, 'job_title');
    });
  });

  describe('getSalaryOutliers', () => {
    it('should build outlier detection query', async () => {
      await repository.getSalaryOutliers();

      expect(knexMock).toHaveBeenCalledWith('employees');

      expect(queryBuilder.select).toHaveBeenCalledWith('*');

      expect(queryBuilder.whereRaw).toHaveBeenCalledWith(
        'salary > (select avg(salary) + 2 * stddev_pop(salary) from employees where country = employees.country)',
      );

      expect(queryBuilder.orWhereRaw).toHaveBeenCalledWith(
        'salary < (select avg(salary) - 2 * stddev_pop(salary) from employees where country = employees.country)',
      );
    });
  });
});
