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

      modify: jest.fn().mockImplementation((cb: any) => {
        const qbMock = { where: jest.fn() };
        cb(qbMock);
        return queryBuilder;
      }),
    };

    knexMock = jest.fn().mockReturnValue(queryBuilder);
    (knexMock as any).raw = jest.fn((sql: string) => `RAW(${sql})`);

    repository = new AnalyticsRepository(knexMock as unknown as Knex);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSalarySummaryByCountry', () => {
    it('should fetch salary summary from summary table ordered by country', async () => {
      await repository.getSalarySummaryByCountry();

      expect(knexMock).toHaveBeenCalledWith('country_salary_summary');

      expect(queryBuilder.select).toHaveBeenCalledWith('*');

      expect(queryBuilder.orderBy).toHaveBeenCalledWith('country');
    });
  });

  describe('getAverageSalaryByJobTitle', () => {
    it('should build query without country filter', async () => {
      await repository.getAverageSalaryByJobTitle();

      expect(knexMock).toHaveBeenCalledWith('country_job_title_salary_summary');

      expect(queryBuilder.select).toHaveBeenCalledWith('job_title');

      expect((knexMock as any).raw).toHaveBeenCalledWith(
        'total_salary / NULLIF(employee_count, 0) AS avg_salary',
      );

      expect(queryBuilder.select).toHaveBeenCalledWith('employee_count');

      expect(queryBuilder.orderBy).toHaveBeenCalledWith('job_title');
    });

    it('should add country filter when country is provided', async () => {
      await repository.getAverageSalaryByJobTitle('India');

      expect(queryBuilder.modify).toHaveBeenCalled();

      const modifyCallback = queryBuilder.modify.mock.calls[0][0];

      const qbMock = { where: jest.fn() };

      modifyCallback(qbMock);

      expect(qbMock.where).toHaveBeenCalledWith('country', 'India');
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
