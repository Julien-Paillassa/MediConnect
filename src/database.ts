import pgPromise, { IMain } from 'pg-promise';

const pgp: IMain = pgPromise({});

const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'mediconnect',
  user: 'postgres',
  password: 'postgres',
};

const db = pgp(dbConfig);

export default db;