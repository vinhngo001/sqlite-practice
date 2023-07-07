const express = require("express");
const router = express.Router();
const { db } = require("../db");

router.post("/", async (req, res) => {
    try {
        const { code, name } = req.body;
        if (!code || !name) {
            return res.status(400).json({ error: "Missing code or/and name" });
        }
        db.run('INSERT INTO Department (code, name) VALUES (?, ?)', [code, name], function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(201).json({ success: "Tạo phòng ban mới thành công", id: this.lastID });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: error.message });
    }
});

router.get("/", async (req, res) => {
    db.all('SELECT * FROM Department', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ success: "Lấy dữ liệu thành công", department: rows });
        }
    });
})

module.exports = router;