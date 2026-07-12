const dashboardService = require('../services/dashboard.service');

const getDashboard = async (req, res) => {
  try {
    const kpis = await dashboardService.getDashboardKPIs();
    res.status(200).json({ success: true, data: kpis });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching dashboard data', error: error.message });
  }
};

module.exports = {
  getDashboard
};
