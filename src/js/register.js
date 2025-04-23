// routes/register.js
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../../db'); // Adjust path to your db.js

router.post('/register', async (req, res) => {
    const { nev, email, jelszo } = req.body;
    const szerep = 'utas';

    if (!nev || !email || !jelszo) {
        return res.status(400).json({ error: 'Minden mezőt ki kell tölteni!' });
    }
    console.log(nev, email, jelszo, szerep);

    try {
        const hashedPassword = await bcrypt.hash(jelszo, 10);
        console.log("Hash kész:", hashedPassword);

        const sql = `
            INSERT INTO FELHASZNALO (id, nev, email, jelszo, szerep)
            VALUES (felhasznalo_seq.NEXTVAL, :nev, :email, :jelszo, :szerep)
        `;

        const result = await db.execute(sql, {nev, email, jelszo: hashedPassword, szerep});
        console.log("Adatbázisba írás eredménye:", result);

        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Hiba történt a regisztráció során. ${err}` });
    }
});

module.exports = router;
