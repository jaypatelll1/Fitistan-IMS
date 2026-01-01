const DashboardManager = require('../../businesslogic/managers/DashboardManager');
const { appWrapper } = require('../routeWrapper');
const express = require('express');
const router = express.Router();
const { ACCESS_ROLES } = require('../../businesslogic/accessmanagement/roleConstants');

router.get(
  '/top-selling',
  appWrapper(async (req, res) => {
    const data = await DashboardManager.getTopSellingProducts();
    res.json({ success: true, data });
  },[ACCESS_ROLES.ACCOUNT_ADMIN]
));

router.get(
  '/least-selling',
  appWrapper(async (req, res) => {
    const data = await DashboardManager.getLeastSellingProducts();
    res.json({ success: true, data });
  })
);

module.exports = router;