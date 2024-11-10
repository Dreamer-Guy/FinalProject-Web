const config = {
  mongodb: {
    url: "mongodb://localhost:27023",
    databaseName: "MyShop",
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
