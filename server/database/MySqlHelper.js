import Utility from '../common/Utility';

const mysql = require('mysql');

/**
 * 操作类型，插入，更新，删除，查询
 */
const OperatorType = {
  Insert: 0,
  Update: 1,
  Delete: 2,
  QueryList: 3,
  QueryOne: 4,
}

export default class MySqlHelper {

  constructor(dbConfig) {
    // this.initPool(dbConfig);
  }

  async initPool(dbConfig) {
    console.log('--initPool-----');
    Utility.printLog('-----init pool-----');
    this.pool = mysql.createPool(dbConfig)

    this.pool.on('error', (err) => {
      Utility.printLog('error:', err);
    });
    this.pool.on('connection', (cnn) => {
      Utility.printLog('connection 成功');
    });
    this.pool.on('release', (cnn) => {
      console.log('===Connection【 %d 】 released===', cnn.threadId);
      Utility.printLog(`=== Connection【 ${cnn.threadId} 】 released === 成功`);
    });
  }

  async poolInfo() {
    if (!this.pool) {
      await this.initPool();
    }
    if (!this.pool) {
      return null
    }
    return this.pool;
  }

  async _execTran(sql) {
    console.log('-----开始执行---');
    const { __beginTranConn, __isBeginTran } = this;
    return await new Promise((resolve, reject) => {
      __beginTranConn.query(sql, async (err, result, fields) => {
        try {
          if (err) {
            console.log('事务回滚-->', sql);
            await this.rollBack();
            reject(err);
          } else {
            resolve({ result });
          }
        } catch (ex) {
          reject(ex);
        }
      });
    });
  }

  async _exe_sql(type, sql) {
    const self = this;
    const { __beginTranConn, __isBeginTran } = this;
    if (!!__isBeginTran) {
      return await this._execTran(sql);
    }

    try {
      const conn = await self.getConnection();
      console.log('---_exe_sql--threadId--------', conn.threadId);
      if (!conn) {
        return null;
      }
      return await new Promise((resolve, reject) => {
        conn.query(sql, (err, result, fields) => {
          if (err) {
            reject(err);
            return;
          }
          conn.release();
          resolve({ result, fields });
        });
      });
    } catch (ex) {
      throw new Error(ex.message);
    }
  }

  async _execSqlTran(conn, sql) {
    console.log('--_execSqlTran--threadId--------', conn.threadId);
    return await new Promise((resolve, reject) => {
      conn.query(sql, (err, result, field) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * 查询
   * 
   * @param {any} sql 
   * @returns 
   * @memberof MySqlHelper
   */
  async queryTran(conn, sql) {
    return await this._execSqlTran(conn, sql);
  }

  async queryOne(sql) {
    const data = await this._exe_sql(OperatorType.QueryOne, sql);
    const { result, fields } = data;
    // Utility.printLog('fields:', fields);
    return result && result.length > 0 ? result[0] : null;
  }

  async insertSql(sql) {
    const data = await this._exe_sql(OperatorType.Insert, sql);
    return data;
  }
  async UpdateSql(sql) {
    const data = await this._exe_sql(OperatorType.Update, sql);
    return data;
  }

  async queryOneTran(conn, sql) {
    console.log('--queryOneTran-threadId---------', conn.threadId);
    const result = await this._execSqlTran(conn, sql);
    // console.log(data);
    // const { result } = data;
    return result && result.length > 0 ? result[0] : {};
  }

  /**
   * 更新
   * 
   * @param {any} sql 
   * @returns 
   * @memberof MySqlHelper
   */
  async updateTran(conn, sql) {
    console.log('--updateTran-threadId-----------', conn.threadId);
    return await this._execSqlTran(conn, sql);
  }

  /**
   * 插入
   * 
   * @param {any} sql 
   * @returns 
   * @memberof MySqlHelper
   */
  async insertTran(conn, sql) {
    console.log('--insertTran-threadId-----------', conn.threadId);
    console.log(sql);
    return await this._execSqlTran(conn, sql);
  }


  async deleteTran(conn, sql) {
    console.log('--deleteTran-threadId---', conn.threadId);
    return await this._execSqlTran(conn, sql);
  }


  /**
   * 批量插入
   * 
   * @param {any} sql 
   * @param {any} values 
   * @returns 
   * @memberof MySqlHelper
   */
  async batchInsert(sql, values) {
    const self = this;
    await this.beginTranaction();
    return await new Promise((resolve, reject) => {
      this.__beginTranConn.query(sql, [values], async (err, result, fields) => {
        if (err) {
          await self.rollBack();
          reject(err);
          return;
        }
        await self.commit();
        resolve({ msg: 'ok' });
      });
    });
  }

  /**
   * 获取连接
   * 
   * @returns 
   */
  async getConnection() {
    const self = this;
    return await new Promise(async (resolve, reject) => {
      try {
        const pi = await this.poolInfo();
        pi.getConnection((err, conn) => {
          if (err) {
            reject(err);
          } else {
            resolve(conn);
          }
        });
      } catch (ex) {
        return reject(ex);
      }
    });
  }

  /**
   * 开始事务
   * 
   * @returns 返回一个连接。
   * @memberof MySqlHelper
   */
  async beginTranaction() {
    return await new Promise(async (resolve, reject) => {
      try {
        const pi = await this.poolInfo();
        if (!pi) {
          reject({ msg: '数据库连接池错误。' });
        }
        // console.log('----------获取 connection------------');
        pi.getConnection((err, conn) => {
          // console.log('------------获取成功--------');
          if (err) {
            reject(err);
          } else {
            // console.log('----------获取 打开事务-----------');
            conn.beginTransaction((bErr) => {
              if (bErr) {
                reject(bErr);
              } else {
                // console.log('----------获取 事务开启成功-----------');
                resolve(conn);
              }
            });
          }
        });
      } catch (ex) {
        reject(ex);
      }
    });
  }

  /**
   * 回滚
   * 
   * @param {any} conn 
   * @returns 
   * @memberof MySqlHelper
   */
  async rollback(conn) {
    return await new Promise((resolve, reject) => {
      console.log('--rollback1--threadId-----------', conn.threadId);
      conn.rollback((err) => {
        conn.release();
        console.log('conn.rollback', err);
        if (err) {
          reject(err);
        } else {
          resolve({ msg: 'ok' });
        }
      });
    });
  }

  /**
   * 提交
   * 
   * @param {any} conn 
   * @returns 
   * @memberof MySqlHelper
   */
  async commit(conn) {
    return await new Promise((resolve, reject) => {
      console.log('--commit1--threadId-------------', conn.threadId);
      conn.commit((err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ msg: 'ok' });
        }
      });
    });
  }

  /**
   * 关闭连接
   * 
   * @returns 
   */
  async closePool() {
    const self = this;
    return await Promise(async (resolve, reject) => {
      const pi = await self.poolInfo();
      if (!pi) {
        resolve({ msg: 'ok' });
        return;
      }
      pi.end((err) => {
        if (err) {
          reject(err);
          return;
        }
        delete self.pool;
        resolve({ msg: 'ok' });
      });
    });
  }
}