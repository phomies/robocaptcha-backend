import express from 'express';

const router = express.Router();

router.get('/', function (req, res) {
    res.status(200).json({ message: 'CallCAPTCHA backend is working' });
});

export default router;
