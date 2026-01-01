const cron = require('node-cron');
const DashboardManager = require('../../businesslogic/managers/DashboardManager');

class DashboardCronManager {

  static start() {

    console.log(' DashboardCronManager started (cron registered)');

    // Run Every 10 minutes
    cron.schedule('*/10 * * * *', async () => {
      try {
        console.log('[CRON] Dashboard refresh started');

        // Call existing logic
        const topSelling = await DashboardManager.getTopSellingProducts();
        const leastSelling = await DashboardManager.getLeastSellingProducts();

        // OPTIONAL: store somewhere / cache / log
        console.log('[CRON] Top selling count:', topSelling.length);
        console.log('[CRON] Least selling count:', leastSelling.length);

        console.log('[CRON] Dashboard refresh completed');
      } catch (error) {
        console.error('[CRON] Dashboard refresh failed:', error);
      }
    });
  }

}

module.exports = DashboardCronManager;
