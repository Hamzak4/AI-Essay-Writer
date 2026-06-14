const express = require('express');
const User = require('../models/User');
const Essay = require('../models/Essay');
const { requireAdmin } = require('../middleware/admin');

const router = express.Router();

router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEssays = await Essay.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalBanned = await User.countDocuments({ isBanned: true });
    const unverified = await User.countDocuments({ isVerified: false });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const usersToday = await User.countDocuments({ createdAt: { $gte: today } });
    const essaysToday = await Essay.countDocuments({ createdAt: { $gte: today } });
    const last7days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeUsers7d = await User.countDocuments({ createdAt: { $gte: last7days } });
    const essays7d = await Essay.countDocuments({ createdAt: { $gte: last7days } });

    const userGrowth = await User.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    const essayGrowth = await Essay.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    res.json({
      totalUsers,
      totalEssays,
      totalAdmins,
      totalBanned,
      unverified,
      usersToday,
      essaysToday,
      activeUsers7d,
      essays7d,
      userGrowth,
      essayGrowth,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const filter = req.query.filter || '';

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (filter === 'banned') query.isBanned = true;
    if (filter === 'admin') query.role = 'admin';
    if (filter === 'unverified') query.isVerified = false;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password -verificationCode -verificationCodeExpires')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ users, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/users/:id/ban', requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ error: 'Cannot ban admin users' });

    user.isBanned = !user.isBanned;
    await user.save();
    res.json({ message: `User ${user.isBanned ? 'banned' : 'unbanned'}`, isBanned: user.isBanned });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/users/:id', requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ error: 'Cannot delete admin users' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/essays', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';

    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Essay.countDocuments(query);
    const essays = await Essay.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const mapped = essays.map(e => ({
      _id: e._id,
      title: e.title,
      topic: e.topic,
      content: e.content,
      tone: e.tone,
      wordCount: e.wordCount,
      type: e.type,
      createdAt: e.createdAt,
      user: e.userId ? { name: e.userId.name, email: e.userId.email } : null,
    }));

    res.json({ essays: mapped, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/essays/:id', requireAdmin, async (req, res) => {
  try {
    const essay = await Essay.findByIdAndDelete(req.params.id);
    if (!essay) return res.status(404).json({ error: 'Essay not found' });
    res.json({ message: 'Essay deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
