const oracledb = require('oracledb');

const dbConfig = {
    user: 'SYSTEM',
    password: 'user',
    connectString: 'localhost:1521'
};

async function initialize() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('initialize() error: ', err);
    }
}

async function close() {
    try {
        await oracledb.getPool().close();
        console.log('Connection pool closed');
    } catch (err) {
        console.error('close() error: ', err);
    }
}

async function execute(sql, binds = [], options = {}) {
    let conn;
    options.outFormat = oracledb.OUT_FORMAT_OBJECT;
    options.timeout = 5000;
    try {
        conn = await oracledb.getConnection();
        const result = await conn.execute(sql, binds, options);
        await conn.commit();
        return result;
    } catch (err) {
        console.error('execute() error: ', err);
        throw err; // Dobd újra, hogy a hívó oldal is tudja kezelni
    } finally {
        if (conn) await conn.close();
    }
}

module.exports = { initialize, close, execute };
