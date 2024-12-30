const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../db');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.findOne({ where: { email } });
        if (user) return res.status(400).json({ message: 'User with email already exists' });

        const new_user = await User.create({ name, email, password: hashedPassword });
        const token = jwt.sign({ user_id: new_user.id }, 'your_jwt_secret');
        res.status(201).json({ token, user: new_user });
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: 'Error creating user' });
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign({ user_id: user.id }, 'your_jwt_secret');
        res.status(201).json({ token, user });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in' });
    }
});

router.get('/verify', auth, async (req, res) => {
    try {

        const user = await User.findOne({ where: { id: req.user.user_id } });
        if (!user) return res.status(400).json({ message: 'User not found' })

        res.status(201).json({ user });

    } catch {
        res.status(500).json({ message: 'User not found' });
    }
})

module.exports = router;
