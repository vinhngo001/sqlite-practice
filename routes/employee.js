const express = require("express");
const router = express.Router();
const { db } = require("../db");

router.post("/", async (req, res) => {
    try {
        const { code, name, phone, email, sex, avatar } = req.body;
        if (!code) {
            db.get('SELECT code FROM Employee ORDER BY id DESC LIMIT 1', (err, row) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    let newCode = '00001-Emp'; // Giá trị mặc định nếu không có Employee tạo trước đó

                    if (row) {
                        const lastCode = row.code;
                        const codeParts = lastCode.split('-');
                        const incrementedNumber = parseInt(codeParts[0]) + 1;
                        newCode = `${incrementedNumber.toString().padStart(5, '0')}-Emp`;
                    }

                    // Thêm mới Employee với code tự động tạo
                    db.run('INSERT INTO Employee (code, name, phone, email, sex, avatar) VALUES (?, ?, ?, ?, ?, ?)',
                        [newCode, name, phone, email, sex, avatar], function (err) {
                            if (err) {
                                res.status(500).json({ error: err.message });
                            } else {
                                res.status(201).json({ id: this.lastID, ...this });
                            }
                        });
                }
            });
        } else {
            db.run('INSERT INTO Employee (code, name, phone, email, sex, avatar) VALUES (?, ?, ?, ?, ?, ?)', [code, name, phone, email, sex, avatar], function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(201).json({ id: this.lastID, ...this });
                }
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: error.message });
    }
});

router.get("/", async (req, res) => {
    db.all('SELECT * FROM Employee', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(rows);
        }
    });
});

router.get("/:id", async (req, res) => {
    let sql = `SELECT * FROM Employee  WHERE id  = ?`;
    const { id } = req.params;
    db.get(sql, [id], function (err, row) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        if (!row) {
            return res.status(400).json({ error: "Khồng tìm thấy dữ liệu" });
        }

        res.json({ success: "Lấy dữ liệu thành công", employee: row });
    });
});

router.put("/:id", async (req, res) => {
    const { name, phone, email, sex, avatar } = req.body;
    const { id } = req.params;
    let sql = `UPDATE Employee SET name=?, phone=?, email=?, sex=?, avatar=?  WHERE id=?`;
    // const inputData = [name, phone, email, sex, avatar, id];
    let inputData = [];
    if (name) inputData.push(name);
    if (phone) inputData.push(phone);
    if (email) inputData.push(email);
    if (sex) inputData.push(sex);
    if (avatar) inputData.push(avatar);

    db.run(sql, [...inputData, id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        res.json({ success: "Cập nhật dữ liệu thành công" });
    })
});

router.delete("/:id", async (req, res) => {
    let sql = `DELETE FROM Employee WHERE id = ?`;
    const { id } = req.params;
    db.get(`SELECT * FROM Department_Employee  WHERE  employeeId= ?`, [id], function (err, row) {
        if (row) {
            return res.status(400).json({ error: "Nhân viên đang làm việc ở 1 phòng ban" });
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