const analyticsService = require('../services/analytics.service');

const getAnalytics = async (req, res) => {
  try {
    const data = await analyticsService.getAnalyticsMetrics();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching analytics', error: error.message });
  }
};

const getChartData = async (req, res) => {
  try {
    const data = await analyticsService.getChartData();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching chart data', error: error.message });
  }
};

module.exports = {
  getAnalytics,
  getChartData
};
