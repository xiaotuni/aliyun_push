import mongoose from 'mongoose';
import Utility from '../common/Utility';

mongoose.Promise = global.Promise;

export default class MongoDbHelper {

  /**
   * 打开数据库连接
   *
   * @static
   * @param {*} uri
   * @returns
   * @memberof MongoDbHelper
   */
  static async connect(uri) {
    Utility.printLog('mongdb url...', uri);
    return await new Promise((resolve, reject) => {
      mongoose.connection
        .on('error', error => reject(error))
        .on('close', () => console.log('Database connection closed.'))
        .once('open', () => {
          Utility.printLog('mongodb 连接成功...');
          resolve(mongoose.connections[0])
        });
      mongoose.connect(uri, { useNewUrlParser: true });
    });
  }

  /**
   * 关闭数据库连接
   *
   * @static
   * @returns
   * @memberof MongoDbHelper
   */
  static async close() {
    return await new Promise((resolve, reject) => {
      mongoose.disconnect((err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
}

// export function connectDatabase(uri) {
//   console.log('connect to %s', uri);
//   return new Promise((resolve, reject) => {
//     mongoose.connection
//       .on('error', error => reject(error))
//       .on('close', () => console.log('Database connection closed.'))
//       .once('open', () => resolve(mongoose.connections[0]));
//     mongoose.connect(uri, { useMongoClient: true });
//   });
// }

// export function closeConnections() {
//   return new Promise((resolve, reject) => {
//     mongoose.disconnect((err) => {
//       if (err) {
//         return reject(err);
//       }
//       resolve();
//     });
//   });
// }
