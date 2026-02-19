const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// Campaign routes
router.get('/campaigns', dataController.getCampaigns);
router.get('/campaigns/export', dataController.exportCampaigns);
router.get('/campaigns/analytics', dataController.getCampaignAnalytics);

module.exports = router;
