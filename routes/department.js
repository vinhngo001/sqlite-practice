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
});

router.put("/:id", async (req, res) => {
    const { code, name } = req.body;
    const { id } = req.params;
    let sql = `UPDATE Department SET code=?, name=? WHERE id=?`;

    let inputData = [];
    if (name) inputData.push(name);
    if (code) inputData.push(code);

    db.run(sql, [...inputData, id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        res.json({ success: "Cập nhật dữ liệu thành công" });
    })
});

router.delete("/:id", async (req, res) => {
    let sql = `DELETE FROM Department WHERE id = ?`;
    const { id } = req.params;
    db.get(`SELECT * FROM Department_Employee WHERE departmentId= ?`, [id], function (err, row) {
        if (row) {
            return res.status(400).json({ error: "Phòng ban đang có nhân viên làm việc" });
        } else {
            db.run(sql, [id], function (err) {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }

                res.json({ success: "Xóa dữ liệu thành công" });
            });
        }
    })
});

module.exports = router;