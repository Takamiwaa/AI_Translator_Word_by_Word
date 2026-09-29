const { TranslationHistory } = require('../models');
const { Op } = require('sequelize');

exports.getHistoryList = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    const whereClause = { user_id: 1 };
    if (search.trim()) {
      whereClause[Op.or] = [
        { source_text: { [Op.like]: `%${search}%` } },
        { target_text: { [Op.like]: `%${search}%` } },
        { source_language: { [Op.like]: `%${search}%` } },
        { target_language: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await TranslationHistory.findAndCountAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return res.json({
      success: true,
      total: count,
      page,
      pages: Math.ceil(count / limit),
      history: rows
    });
  } catch (err) {
    next(err);
  }
};

exports.getHistoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await TranslationHistory.findOne({ where: { id, user_id: 1 } });
    if (!item) {
      return res.status(404).json({ success: false, error: 'History record not found.' });
    }
    return res.json({ success: true, item });
  } catch (err) {
    next(err);
  }
};

exports.deleteHistoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await TranslationHistory.destroy({ where: { id, user_id: 1 } });
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'History item not found.' });
    }
    return res.json({ success: true, message: 'History record deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
