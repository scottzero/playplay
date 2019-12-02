// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/playplay_dev',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/playplay_test',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'pg',
    connection: 'postgres://qvevezsuqcndls:0ec04bd48ce3a2c66c799130cd2d69f164666588cd05e1932eaf05ec5d593a18@ec2-174-129-255-76.compute-1.amazonaws.com:5432/dc1f5hm1gd3viu',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }
};
