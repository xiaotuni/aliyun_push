import fs from "fs";

export default class FileHelper {
  static throwMsg(msg) {
    throw new Error(msg);
  }

  /**
   * 读取JSON文件
   *
   * @static
   * @param {*} filePath
   * @returns
   * @memberof FileHelper
   */
  static readFileByJSON(filePath) {
    // 判断文件是否存在。
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
      throwMsg('文件未找到');
    }
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
    // return data;
  }

  /**
   * 向文件中写入JSON数据
   *
   * @static
   * @param {*} filePath
   * @param {*} content
   * @memberof FileHelper
   */
  static writeFileByJson(filePath, content) {
    // 判断文件是否存在。
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
      throwMsg('文件未找到');
    }
    fs.writeFileSync(filePath, JSON.stringify(content));
  }
}