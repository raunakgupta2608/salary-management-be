import knex from 'knex';
import { EmployeeRepository } from './employee.repository';
import { testKnexConfig } from '../../test-knex-config';

describe('EmployeeRepository (SQLite integration)', () => {
  let db: knex.Knex;
  let repository: EmployeeRepository;

  beforeAll(async () => {
    db = knex(testKnexConfig);

    await db.schema.createTable('employees', (table) => {
      table.increments('id');
      table.string('name');
    });

    repository = new EmployeeRepository(db as any);
  });

  beforeEach(async () => {
    await db('employees').del();

    await db('employees').insert([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
      { id: 4, name: 'D' },
    ]);
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('should paginate correctly without cursor', async () => {
    const result = await repository.findAll(undefined, 2);

    expect(result.data.map((e) => e.id)).toEqual([1, 2]);
    expect(result.hasMore).toBe(true);
    expect(result.nextCursor).toBe(2);
  });

  it('should paginate correctly with cursor', async () => {
    const result = await repository.findAll(2, 2);

    expect(result.data.map((e) => e.id)).toEqual([3, 4]);
    expect(result.hasMore).toBe(false);
    expect(result.nextCursor).toBeNull();
  });

  it('should return empty result when no data', async () => {
    await db('employees').del();

    const result = await repository.findAll(undefined, 10);

    expect(result.data).toEqual([]);
    expect(result.hasMore).toBe(false);
    expect(result.nextCursor).toBeNull();
  });

  it('should return hasMore = false when result equals limit exactly', async () => {
    const result = await repository.findAll(undefined, 4);

    expect(result.data.map((e) => e.id)).toEqual([1, 2, 3, 4]);
    expect(result.hasMore).toBe(false);
    expect(result.nextCursor).toBeNull();
  });

  it('should return empty result when cursor is beyond dataset', async () => {
    const result = await repository.findAll(999, 2);

    expect(result.data).toEqual([]);
    expect(result.hasMore).toBe(false);
    expect(result.nextCursor).toBeNull();
  });
});
