const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { sendVerificationCode } = require('../utils/email');
const passport = require('../config/passport');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function signToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function userResponse(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  };
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const isAdmin = email?.trim().toLowerCase() === process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const user = new User({
      name,
      email,
      password,
      role: isAdmin ? 'admin' : 'user',
      isVerified: false,
    });

    const code = generateCode();
    user.verificationCode = code;
    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
      await sendVerificationCode(email, code);
    } catch (emailErr) {
      console.error('Failed to send verification email:', emailErr.message);
    }

    const token = signToken(user);
    res.status(201).json({ token, user: userResponse(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    if (user.isBanned) {
      return res.status(403).json({ error: 'Account has been banned' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isAdmin = email?.trim().toLowerCase() === process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (isAdmin && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    const token = signToken(user);
    res.json({ token, user: userResponse(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/verify-email', async (req, res) => {
  try {
    const { code } = req.body;
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isVerified) return res.json({ message: 'Already verified', user: userResponse(user) });
    if (user.verificationCode !== code) return res.status(400).json({ error: 'Invalid verification code' });
    if (user.verificationCodeExpires < new Date()) return res.status(400).json({ error: 'Verification code expired' });

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    const newToken = signToken(user);
    res.json({ token: newToken, user: userResponse(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/resend-code', async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isVerified) return res.json({ message: 'Already verified' });

    const code = generateCode();
    user.verificationCode = code;
    user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
      await sendVerificationCode(user.email, code);
    } catch (emailErr) {
      console.error('Failed to resend verification email:', emailErr.message);
    }

    res.json({ message: 'Verification code resent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Google credential required' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        user.googleId = googleId;
        const isAdmin = email?.trim().toLowerCase() === process.env.ADMIN_EMAIL?.trim().toLowerCase();
        if (isAdmin && user.role !== 'admin') {
          user.role = 'admin';
        }
        await user.save();
      } else {
        const isAdmin = email?.trim().toLowerCase() === process.env.ADMIN_EMAIL?.trim().toLowerCase();
        user = await User.create({
          name,
          email,
          password: `google_${googleId}`,
          googleId,
          isVerified: true,
          role: isAdmin ? 'admin' : 'user',
        });
      }
    }
    if (user.isBanned) {
      return res.status(403).json({ error: 'Account has been banned' });
    }

    const token = signToken(user);
    res.json({ token, user: userResponse(user) });
  } catch (err) {
    res.status(500).json({ error: 'Google authentication failed: ' + err.message });
  }
});

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = signToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

module.exports = router;
