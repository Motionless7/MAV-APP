// routes/login.js
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../../db');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Minden mezőt ki kell tölteni!' });
    }

    try {
        const sql = `SELECT * FROM FELHASZNALO WHERE email = :email`;
        const result = await db.execute(sql, { email });

        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Hibás email vagy jelszó.' });
        }

        const isMatch = await bcrypt.compare(password, user.JELSZO);

        if (!isMatch) {
            return res.status(401).json({ error: 'Hibás email vagy jelszó.' });
        }

        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = '/';
        res.redirect('/');

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Hiba történt a bejelentkezés során.' });
    }
});

module.exports = router;
