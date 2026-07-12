const dashboardService = require('../services/dashboard.service');

const getDashboard = async (req, res) => {
  try {
    // Extract filters from query parameters
    const filters = {};
    if (req.query.type) filters.type = req.query.type;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.region) filters.region = req.query.region;

    const kpis = await dashboardService.getDashboardKPIs(filters);
    res.status(200).json({ success: true, data: kpis });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching dashboard data', error: error.message });
  }
};

module.exports = {
  getDashboard
};
