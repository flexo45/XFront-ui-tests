import {FieldDef, Pool, PoolClient, QueryResult} from 'pg';
import {TestConf} from '../test.conf';

export class DbClient {

  private static instance: DbClient = new DbClient(new TestConf().database.configuration);

  private pool: Pool;

  public static getInstance(): DbClient {
    return DbClient.instance;
  }

  private constructor(configuration) {

    if (DbClient.instance) {
      throw new Error('Instance of DbClient already exist, use getInstance()');
    }

    this.pool = new Pool(configuration);

    this.pool.on('error', (err) => {
      // set up pool error listener
      console.error('Unexpected error on idle client', err);
    });

    this.pool.on('connect', (client) => {
      // set up client error listener
      client.on('error', (err) => {
        console.error('something bad has happened!', err.stack);
      });
    });

    this.pool.once('connect', () => {
      // set up pool connect once
      console.log('Pool connected');
      this.execute('create extension if not exists "uuid-ossp"', []).then(() => {
        console.log('uuid-ossp created');
      });
    });
  }

  public async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  public async dispose() {
    console.log('Pool ending');
    await this.pool.end();
  }

  public async getGuid(): Promise<string> {
    const client = await this.getClient();
    const { rows } = await client.query(`select uuid_generate_v4() as Guid`);
    await client.release();
    return rows[0].guid;
  }

  public async select(query: string, params: any[]): Promise<any[]> {
    const client = await this.getClient();
    const result = await client.query(query, params);
    await client.release();
    return result.rows;
  }

  public async selectT<T>(model: T, query: string, params: any[]): Promise<T[]> {
    const client = await this.pool.connect();
    const result = await client.query(query, params);
    await client.release();
    return this.parseResultToModel<T>(model, result);
  }

  public async selectOne(query: string, params: any[]): Promise<any> {
    const client = await this.getClient();
    const result = await client.query(query, params);
    await client.release();
    return result.rows.shift();
  }

  public async selectOneT<T>(model: T, query: string, params: any[]): Promise<T> {
    const client = await this.getClient();
    const result = await client.query(query, params);
    await client.release();
    return this.parseResultToModel<T>(model, result).shift();
  }

  public async execute(query: string, params: any[]) {
    const client = await this.getClient();
    await client.query(query, params);
    await client.release();
  }

  public async executeTx(tx_function: (client: PoolClient) => Promise<string>): Promise<string> {
    const client = await this.getClient();
    let result;
    try {
      await client.query('BEGIN');
      result = await tx_function(client);
      await client.query('COMMIT');
    } catch (e) {
      console.error('ERROR => ROLLBACK');
      console.error(e);
      await client.query('ROLLBACK');
    } finally {
      await client.release();
    }
    return result;
  }

  private parseResultToModel<T>(model: Object, result: QueryResult): T[] {
    const resultRowsModel: T[] = [];
    const modelProperties = Object.getOwnPropertyNames(model);
    for (const row of result.rows) {
      const rowModel = this.parseRowToModel<T>(row, modelProperties, result.fields);
      resultRowsModel.push(rowModel);
    }
    return resultRowsModel;
  }

  private parseRowToModel<T>(row: Object, modelProperties: string[], fields: FieldDef[]): T {
    const resultRow = {};
    for (const prop of modelProperties) {
      const field = fields.find(x => x.name.toLowerCase() === prop.toLowerCase());
      if (field)
        resultRow[prop] = row[field.name];
    }
    return resultRow as T;
  }
}
