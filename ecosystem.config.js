/**
 * PM2 ecosystem config for Survey Site (non-Docker alternative)
 */
module.exports = {
  apps: [
    {
      name: "survey-site",
      // Ensure this points to your app entry (server.js or dist/server.js)
      script: "server.js",
      // Use all CPU cores
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
        MONGODB_URI: "mongodb://localhost:27017/surveys",
        ALLOWED_ORIGIN: "http://localhost:3000",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        // Update this to your production DB
        MONGODB_URI: "mongodb://localhost:27017/surveys",
        // Update to your actual domain
        ALLOWED_ORIGIN: "https://your-domain.com",
      },
    },
  ],
};
