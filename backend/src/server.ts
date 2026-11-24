import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { config } from './config/env.js';
import { seedData } from './scripts/seed.js';

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDatabase();

    // 2. Automatically seed essential data
    await seedData();

    // 3. Create and launch Express app
    const app = createApp();

    app.listen(config.port, () => {
      console.log(`===============================================`);
      console.log(` Tuition Management System API is LIVE`);
      console.log(` Port: ${config.port}`);
      console.log(` Environment: ${config.nodeEnv}`);
      console.log(` Health: http://localhost:${config.port}/api/health`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
};

startServer();
