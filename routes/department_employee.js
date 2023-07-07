const express = require("express");
const router = express.Router();
const { db } = require("../db");

router.post("/", async (req, res) => {
    const { departmentId, employeeId } = req.body;
    let sqltEmployee = `SELECT * FROM Employee  WHERE id  = ?`;
    db.get(sqltEmployee, [Number(employeeId)], function (err, row) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        if (!row) {
            return res.status(400).json({ error: "Không tìm thấy dữ liệu nhân viên" });
        }

        let sqltDepartment = `SELECT * FROM Department  WHERE id  = ?`;
        db.get(sqltDepartment, [Number(departmentId)], function (err, row) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            if (!row) {
                return res.status(400).json({ error: "Không tìm thấy dữ liệu phòng ban" });
            }
            db.run(`INSERT INTO Department_Employee (departmentId, employeeId) VALUES (?, ?)`, [departmentId, employeeId], function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                } else {
                    res.json({ success: "Thêm nhân viên vào phong ban thành công", id: this.lastID });
                }
            });
        });
    });
});
router.get("/", (req,res)=>{
    let sql = `SELECT * FROM Department_Employee`;
    db.all(sql, function (err, rows) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        res.json({ success: "Lấy dữ liệu thành công", rows });
    });
});

router.delete("/:id", async (req, res) => {
    let sql = `DELETE FROM Department_Employee WHERE id = ?`;
    const { id } = req.params;
    db.run(sql, [id], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        res.json({ success: "Xóa dữ liệu thành công" });
    });
});
module.exports = router;
