const oracledb = require('oracledb');

const dbConfig = {
    user: 'C##QYO2PE',
    password: 'Slavsquat777',
    connectString: 'linux.inf.u-szeged.hu:22/orania2' // or whatever service name your DB uses
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
    try {
        conn = await oracledb.getConnection();
        const result = await conn.execute(sql, binds, options);
        return result;
    } catch (err) {
        console.error('execute() error: ', err);
    } finally {
        if (conn) await conn.close();
    }
}

module.exports = { initialize, close, execute };
