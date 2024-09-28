module.exports = {
    PORT: process.env.PORT || 3000,
    DB: process.env.DB_URL || 'mongodb://mongodb:27017/chatapp-test',
    JWT_SECRET: process.env.JWT_SECRET || "sample_secret",
};