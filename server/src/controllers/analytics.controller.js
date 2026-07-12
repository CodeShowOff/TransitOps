const analyticsService = require('../services/analytics.service');

const getAnalytics = async (req, res) => {
  try {
    // Extract filters from query parameters
    const filters = {};
    if (req.query.vehicleType) filters.vehicleType = req.query.vehicleType;
    if (req.query.driverStatus) filters.driverStatus = req.query.driverStatus;
    if (req.query.region) filters.region = req.query.region;
    if (req.query.dateRange) filters.dateRange = req.query.dateRange;

    const data = await analyticsService.getAnalyticsMetrics(filters);
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
