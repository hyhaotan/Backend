import express from 'express';
import { adminLogin } from '../controllers/admin.js';

const router = express.Router();

router.get('/adminlogin', (req, res) => {
  res.render('adminlogin', { error: null, baseUrl: process.env.BASE_URL || '' });
});

router.post('/adminlogin', adminLogin);

export default router;
