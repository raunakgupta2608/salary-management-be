import { Test, TestingModule } from '@nestjs/testing';
import { CountrySalaryCronService } from './analytics-cron';
import { AnalyticsRepository } from '../../analytics/analytics.repository';

describe('CountrySalaryCronService', () => {
  let service: CountrySalaryCronService;
  let analyticsRepo: jest.Mocked<AnalyticsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountrySalaryCronService,
        {
          provide: AnalyticsRepository,
          useValue: {
            refreshCountrySalarySummary: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CountrySalaryCronService>(CountrySalaryCronService);

    analyticsRepo = module.get(AnalyticsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call refreshCountrySalarySummary when cron runs', async () => {
    analyticsRepo.refreshCountrySalarySummary.mockResolvedValue(undefined);

    const logSpy = jest.spyOn(service['logger'], 'log');

    await service.refreshCountrySalarySummary();

    expect(analyticsRepo.refreshCountrySalarySummary).toHaveBeenCalledTimes(1);

    expect(logSpy).toHaveBeenCalledWith(
      'Starting country_salary_summary rebuild...',
    );

    expect(logSpy).toHaveBeenCalledWith(
      'country_salary_summary rebuild completed',
    );
  });
});
