const mysql = require('mysql2/promise');
const configmysql = require('./configmysql');
const logger = require('./logger');

let connection;

(async function initialConnection() {
    try {
        connection = await mysql.createConnection({
            host: configmysql.sqlDB.hostmysql,
            user: configmysql.sqlDB.usermysql,
            password: configmysql.sqlDB.passwordmysql,
            database: configmysql.sqlDB.databasemysql,
            pool: configmysql.sqlDB.portmysql,
        });
        logger.info('Connected to mysql successfully');
    } catch (error) {
        log.error('Error connecting to mysql:', error);
        process.exit(1);
    }
})();

module.exports = {
    mysql: connection,
}
