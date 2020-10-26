const mysql = require("mysql");
const CONFIG = require("../config/config");

const con = mysql.createConnection({
  host: CONFIG.IP,
  user: CONFIG.USER_MYSQL,
  password: CONFIG.PASS_MYSQL,
  database: CONFIG.DB_MYSQL,
});

module.exports = {
  con
};