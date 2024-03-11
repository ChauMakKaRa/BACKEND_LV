const config = {
  app: {
    port: process.env.PORT || 3001,
  },
  db: {
    uri: process.env.MONGODB_URL || "mongodb://localhost:27017/luan_van",
  },
};
module.exports = config;
