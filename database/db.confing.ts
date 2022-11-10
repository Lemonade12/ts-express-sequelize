module.exports = {
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_DATABASE,
  HOST: process.env.DB_HOST,
  dialect: "mysql",
  timezone: "+09:00",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
