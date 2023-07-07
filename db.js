
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./test.db', sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
		return console.error(err.message)
	}
});

function connectDB() {
	// Tạo bảng Employee
	db.serialize(() => {
		db.run(`CREATE TABLE IF NOT EXISTS Employee (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT,
      name TEXT,
      phone TEXT,
      email TEXT,
      sex INTEGER,
      avatar TEXT
    )`);
	});

	// Tạo bảng Department
	db.serialize(() => {
		db.run(`CREATE TABLE IF NOT EXISTS Department (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT,
      name TEXT
    )`);
	});

	// Tạo bảng Department_Employee
	db.serialize(() => {
		db.run(`CREATE TABLE IF NOT EXISTS Department_Employee (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employeeId INTEGER,
      departmentId INTEGER,
      FOREIGN KEY (employeeId) REFERENCES Employee(id),
      FOREIGN KEY (departmentId) REFERENCES Department(id)
    )`);
	});
}

module.exports = {
	db,
	connectDB
}