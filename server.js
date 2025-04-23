const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;
const DB = require("./db.js");
const bcrypt = require("bcryptjs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // For CSS/JS if any
app.use(express.json());

// Serve pages
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "src/view/index.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "src/view/login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "src/view/register.html")));

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

DB.initialize().then(() => {
    console.log('connection is fine');
});


app.post("/register", async (req, res) => {
    const { nev, email, jelszo } = req.body;
    const szerep = 'utas';

    if (!nev || !email || !jelszo) {
        return res.status(400).send("Hiányzó adatok.");
    }

    try {
        const hashedPassword = await bcrypt.hash(jelszo, 10);

        const sql = `
            INSERT INTO FELHASZNALO (id, nev, email, jelszo, szerep)
            VALUES ((SELECT NVL(MAX(id), 0) + 1 FROM FELHASZNALO), :nev, :email, :jelszo, :szerep)
        `;

        await DB.execute(sql, {
            nev,
            email,
            jelszo: hashedPassword,
            szerep
        });

        res.redirect("/login"); // or res.send("Sikeres regisztráció!");
    } catch (err) {
        console.error("Hiba a regisztráció során:", err);
        res.status(500).send("Hiba történt.");
    }
});
