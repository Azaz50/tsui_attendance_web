const Sale = require('../models/saleModel');
const Visit = require('../models/visitModel');
const moment = require('moment');
const db = require('../config/db.config');

exports.saleCreate = async (req, res) => {
  const {
    shop_id,
    user_id,
    number_purches_item,
    selling_rate,
    description,
    total_amount,
    locker_type,
    date,
    time
  } = req.body;

  const timestamp = new Date();

  try {
    // Create Sale
    const sale = {
      shop_id,
      user_id,
      date,
      time,
      number_purches_item,
      selling_rate,
      description,
      total_amount,
      locker_type,
      created_at: timestamp,
      updated_at: timestamp
    };


    const saleResult = await Sale.createSale(sale);

    // Create Visit linked to Sale
    const visit = {
      shop_id,
      user_id,
      visit_date_time: null,
    };

    await Visit.createVisit(visit);

    res.status(201).json({
      message: 'Product Sold successfully',
      saleId: saleResult.insertId,
    });

  } catch (error) {
    console.error('Error creating sale or visit:', error);
    res.status(500).json({
      message: 'Failed to create sale or visit',
      error: error.message,
    });
  }
};


exports.getSale = async (req, res) => {
  const { start_date, end_date, user_id, shop_id } = req.query;

  try {
    const data = await Sale.getSales({ start_date, end_date, user_id, shop_id });

     const formattedData = data.map(item => ({
          ...item,
          date: moment(item.date).format("YYYY-MM-DD")
      }));

    res.status(200).json({
      message: 'Sales fetched successfully',
      data: formattedData,
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({
      message: 'Failed to fetch sales',
      error: error.message,
    });
  }
};

exports.getSalesBarChartReport = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: 'user_id is required' });
  }

  try {
    // === DAILY REPORT: past 7 days including today ===
    const moment = require('moment-timezone');
    const TIMEZONE = 'Asia/Kolkata';

    const dailyEnd = moment().tz(TIMEZONE).endOf('day').format('YYYY-MM-DD');
    const dailyStart = moment().tz(TIMEZONE).subtract(6, 'days').startOf('day').format('YYYY-MM-DD');


    const dailyQuery = `
      SELECT DATE(date) AS sale_date, SUM(total_amount) AS total_sales
      FROM sales
      WHERE user_id = ? AND DATE(date) BETWEEN ? AND ?
      GROUP BY DATE(date)
      ORDER BY DATE(date)
    `;
    const [dailyRows] = await db.query(dailyQuery, [user_id, dailyStart, dailyEnd]);

    // Create default 7-day list to fill in missing dates
    const dailyData = [];

    for (let i = 0; i < 7; i++) {
      const fullDate = moment().subtract(i, 'days').format('YYYY-MM-DD');
      const displayDay = moment(fullDate).format('DD');

      const row = dailyRows.find(r => moment(r.sale_date).format('YYYY-MM-DD') === fullDate);

      dailyData.push({
        day: displayDay,
        total_sales: row ? parseFloat(row.total_sales) : 0,
      });
    }
    
    dailyData.reverse();

    // === MONTHLY REPORT: current month (up to today) + 6 previous full months ===
    const currentDate = moment();
    const monthlyData = [];

    // Current month (from 1st to today)
    const startCurrentMonth = currentDate.clone().startOf('month').format('YYYY-MM-DD');
    const endCurrentMonth = currentDate.clone().format('YYYY-MM-DD');

    const [currentMonthRows] = await db.query(`
      SELECT SUM(total_amount) AS total_sales
      FROM sales
      WHERE user_id = ? AND DATE(date) BETWEEN ? AND ?
    `, [user_id, startCurrentMonth, endCurrentMonth]);

    monthlyData.push({
    month: currentDate.format('MMM'), // e.g., May
    total_sales: currentMonthRows[0].total_sales ? parseFloat(currentMonthRows[0].total_sales) : 0,
  });

  for (let i = 1; i <= 6; i++) {
    const monthMoment = currentDate.clone().subtract(i, 'months');
    const start = monthMoment.clone().startOf('month').format('YYYY-MM-DD');
    const end = monthMoment.clone().endOf('month').format('YYYY-MM-DD');

    const [rows] = await db.query(`
      SELECT SUM(total_amount) AS total_sales
      FROM sales
      WHERE user_id = ? AND DATE(date) BETWEEN ? AND ?
    `, [user_id, start, end]);

    monthlyData.push({
      month: monthMoment.format('MMM'),
      total_sales: rows[0].total_sales ? parseFloat(rows[0].total_sales) : 0,
    });
  }


    monthlyData.reverse();

    res.status(200).json({
      message: 'Sales report generated successfully',
      daily: dailyData,
      monthly: monthlyData,
    });

  } catch (error) {
    console.error('Error generating sales report:', error);
    res.status(500).json({
      message: 'Failed to generate report',
      error: error.message,
    });
  }
};
