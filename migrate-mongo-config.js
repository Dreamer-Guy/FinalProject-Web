const config = {
  mongodb: {
    url: "mongodb://admin:admin@localhost:27023",
    databaseName: "",
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
