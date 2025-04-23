// routes/register.js
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../../db'); // Adjust path to your db.js

router.post('/', async (req, res) => {
    const { nev, email, jelszo } = req.body;
    const szerep = 'utas';

    if (!nev || !email || !jelszo) {
        return res.status(400).json({ error: 'Minden mezőt ki kell tölteni!' });
    }

    try {
        const hashedPassword = await bcrypt.hash(jelszo, 10);

        const sql = `
            INSERT INTO FELHASZNALO (id, nev, email, jelszo, szerep)
            VALUES ((SELECT NVL(MAX(id), 0) + 1 FROM FELHASZNALO), :nev, :email, :jelszo, :szerep)
        `;

        await db.execute(sql, { nev, email, jelszo: hashedPassword, szerep });

        res.status(201).json({ message: 'Sikeres regisztráció!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Hiba történt a regisztráció során.' });
    }
});

module.exports = router;
