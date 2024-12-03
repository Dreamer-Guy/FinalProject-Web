const config = {
  mongodb: {
    url: "mongodb+srv://thanhvinh2400:Ed4DnAKsvTWn32vw@mydatabase.huvya.mongodb.net",
    databaseName: "doanDB",
    options: {
      // connectTimeoutMS: 3600000, // Optional: increase connection timeout
      // socketTimeoutMS: 3600000,  // Optional: increase socket timeout
    }
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: 'commonjs',
};

export default config;
