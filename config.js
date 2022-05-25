/** TEST RELATED CONFIG */
const dbConfig = {
  'useDB': 'sqlite3',
  'sqlite3': {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: '/home/arno/workspace/plasmid/test.db',
    },
    pool: {
      afterCreate: (conn, cb) =>
        conn.run('PRAGMA foreign_keys = ON', cb),
    },
  },
  'mysql': {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      port: 3306,
      user: 'username',
      password: 'password',
      database: 'database_name',
    },
  },
};

const port = 8081;

module.exports = {
  dbConfig,
  port,
}
