const employeeRouter = require("./employee");
const deparmentRouter = require("./department");
const departmentEmployeeRouter = require("./department_employee");

const baseUrl = "/api";

const webRouter = (app) => {
    app.use(baseUrl + "/employee", employeeRouter);
    app.use(baseUrl + "/department", deparmentRouter);
    app.use(baseUrl + "/dep-emp", departmentEmployeeRouter);
}

module.exports = webRouter;