const express = require('express');
const router = express.Router();
const { addToRecentlyViewed, getRecentlyViewed } = require('../controllers/recentlyViewedController');

// Recently viewed routes
router.post('/:userId/recentlyViewed', addToRecentlyViewed);
router.get('/:userId/recentlyViewed', getRecentlyViewed);

module.exports = router;
