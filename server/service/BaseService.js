import Utility from "../common/Utility";

/**
 * 封装model里面一些基础方法。
 * 
 * @export
 * @class BaseService
 */
export default class BaseService {

  constructor(modal) {
    this.modal = modal;
    /**
     * 表名称
     */
    this.TableName = `${modal.modelName}s`;
  }

  /**
   * 根据ID查询详情
   * 
   * @param {any} id 主键ID值* 
   * @param {any} [displayField={}] 默认显示所有字段，如果想去掉哪个字段的话{field:0}，此时field就不会返回。
   * @returns 
   * @memberof BaseService
   */
  async findById(id, displayField = {}) {
    try {
      const result = await this.modal.findById(id, displayField);
      return result ? result.toJSON() : null;
    } catch (ex) {
      Utility.printLog(ex);
      return null;
    }
  }

  /**
   * 根据ID查询详情(无toJSON)
   *
   * @param {any} id 主键ID值*
   * @param {any} [displayField={}] 默认显示所有字段，如果想去掉哪个字段的话{field:0}，此时field就不会返回。
   * @returns
   * @memberof BaseService
   */
  async findByIdNative(id, displayField = {}) {
    try {
      return await this.modal.findById(id, displayField);
    } catch (ex) {
      Utility.printLog(ex);
      return null;
    }
  }

  /**
   * 根据条件查询出第一记录
   * 
   * @param {any} condition 条件 {field1:'哈哈',type:4 ...}
   * @param {any} [fields={}] 
   * @param {any} [options={}] {sort:{fiel4:-1,..},...}
   * @returns 
   * @memberof BaseService
   */
  async findOne(condition, fields = {}, options = {}) {
    try {
      const result = await this.modal.findOne(condition, fields, options);
      return result ? result.toJSON() : null;
    } catch (ex) {
      Utility.printLog(ex);
      return null;
    }
  }

  /**
   * 根据条件查询出第一记录(无toJSON)
   *
   * @param {any} condition 条件 {field1:'哈哈',type:4 ...}
   * @param {any} [fields={}]
   * @param {any} [options={}] {sort:{fiel4:-1,..},...}
   * @returns
   * @memberof BaseService
   */
  async findOneNative(condition, fields = {}, options = {}) {
    try {
      return await this.modal.findOne(condition, fields, options);
    } catch (ex) {
      Utility.printLog(ex);
      return null;
    }
  }

  /**
   * 根据条件返回一个列表
   * 
   * @static
   * @param {any} condition 条件 {field1:'哈哈',type:4 ...}
   * @param {any} [fields={}] 
   * @param {any} [options={}] {sort:{fiel4:-1,..}, limit:10, skip:0, ...}
   * @returns 
   * @memberof BaseService
   */
  async find(condition = {}, fields = {}, options = {}) {
    try {
      const list = await this.modal.find(condition, fields, options);
      return list ? JSON.parse(JSON.stringify(list)) : [];
    } catch (ex) {
      Utility.printLog(ex);
      return [];
    }
  }

  /**
  * 统计有多少条记录
  * 
  * @static
  * @param {any} condition 
  * @returns 
  * @memberof BaseService
  */
  async count(condition) {
    try {
      return await this.modal.count(condition);
    } catch (ex) {
      Utility.printLog(ex);
      return 0;
    }
  }

  /**
   * 返回null 时，说明更新失败了。
   * 
   * @static
   * @param {any} condition {field1:'哈哈',type:4 ...}
   * @param {any} fields {field1:'张三',time:15000100203,...}
   * @param {any} options {sort:{fiel4:-1,..},...}
   * @returns 
   * @memberof SheepService
   */
  async update(condition, fields, options) {
    try {
      console.log('-----------update--------------');
      console.log(fields);
      return await this.modal.update(condition, { $set: fields }, options);
    } catch (ex) {
      Utility.printLog(ex);
      Utility.throwClientError({ msg: `更新记录失败原因:${ex.message}` });
    }
  }

  /**
   * 返回null 时，说明更新失败了。
   *
   * @static
   * @param {any} condition {field1:'哈哈',type:4 ...}
   * @param {any} fields {field1:'张三',time:15000100203,...}
   * @param {any} options {sort:{fiel4:-1,..},...}
   * @returns
   * @memberof SheepService
   */
  async modify(condition, fields, options) {
    try {
      console.log('-----------modify--------------');
      console.log(condition, fields);
      return await this.modal.update(condition, fields, options);
    } catch (ex) {
      console.log('-----------modify--------------');
      console.log(ex);
      Utility.printLog(ex);
      Utility.throwClientError({ msg: `更新记录失败原因:${ex.message}` });
    }
  }

  /**
   * 根据ID删除记录
   * 
   * @param {any} id 
   * @returns 
   * @memberof BaseService
   */
  async findByIdAndRemove(id) {
    try {
      const result = await this.modal.findByIdAndRemove(id);
      console.log('-----------base service findByIdAndRemove---');
      console.log(result);
      return result ? result.toJSON() : { errMsg: '无效的ID' };
    } catch (ex) {
      Utility.printLog(ex);
      Utility.throwClientError({ msg: `删除失败原因:${ex.message}` });
    }
  }

  /**
   * 根据ID修改内容
   * 
   * @param {any} id 主键
   * @param {any} fields 要修改的字段 {field1:'a',field2:'b'...}
   * @returns 
   * @memberof BaseService
   */
  async findByIdAndUpdate(id, fields) {
    try {
      // const result = await this.modal.findByIdAndUpdate(id, { $set: fields });

      /* **********************************************
       * 由于线上的数据分片在更新的时候要shardKey来进行更新删除操作。
       * 改为先update的方法。
       */
      console.log('-----------base service findByIdAndUpdate---', id , fields);
      const condition = { _id: id };
      await this.modal.update(condition, { $set: fields });
      const result = await this.modal.findById(id);
      return result ? result.toJSON() : null;
    } catch (ex) {
      Utility.printLog(ex);
      Utility.throwClientError({ msg: `【${this.TableName}】更新记录失败原因:${ex.message}` });
    }
  }
  /**
   * 根据ID修改内容
   *
   * @param {any} id 主键
   * @param {any} updateInfo 要修改的内容
   // * @param options new/upset/sort等
   * @returns
   * @memberof BaseService
   */
  async findByIdAndUpdateNoSet(id, updateInfo) {
    try {
      const condition = { _id: id };
      await this.modal.update(condition, updateInfo);
      const result = await this.modal.findById(id);
      return result ? result.toJSON() : null;
    } catch (ex) {
      Utility.printLog(ex);
      Utility.throwClientError({ msg: `更新记录失败原因:${ex.message}` });
    }
  }

  /**
   * 添加一条记录
   * 
   * @param {any} fields 
   * @returns 
   * @memberof BaseService
   */
  async create(fields) {
    try {
      const result = await this.modal.create(fields);
      // console.log(`-add record---${this.TableName}------`);
      return result ? result.toJSON() : null;
    } catch (ex) {
      Utility.printLog(ex);
      Utility.throwClientError({ msg: `添加表记录失败原因:${ex.message}` });
    }
  }

  /**
   * 添加一条记录
   * 
   * @param {any} fields 
   * @returns 
   * @memberof BaseService
   */
  async insert(fields) {
    return this.create(fields);
  }

  /**
   * 添加一条记录
   * 
   * @param {any} fields 
   * @returns 
   * @memberof BaseService
   */
  async save(fields) {
    return this.create(fields);
  }

  /**
   * 添加多条记录
   *
   * @param {any} fields
   * @returns
   * @memberof BaseService
   */
  async insertMany(array) {
    try {
      const result = await this.modal.insertMany(array);
      console.log(`-add record---${this.TableName}------`);
      return result;
    } catch (ex) {
      Utility.printLog(ex);
      Utility.throwClientError({ msg: `添加表记录失败原因:${ex.message}` });
    }
  }

  /**
   * 统计
   * 
   * @param {any} params [ {$match: {} }, {$group: {} },{$sort} ...]
   * @returns 
   * @memberof BaseService
   */
  async aggregate(params) {
    return await this.modal.aggregate(params);
  }

  /**
   * 判断model是否存在
   * 
   * @param {any} id 
   * @returns 
   * @memberof BaseService
   */
  async CheckIsExists(id, displayField) {
    const { modelName } = this.modal;
    if (!Utility.isMongoDBObjectId(id)) {
      Utility.throwServerError({ msg: ` ${modelName} ID不正确` });
    }
    const info = await this.modal.findById(id, displayField);
    if (!info) {
      Utility.throwClientError({ status: 404, msg: `${id}：数据不存在或已经移除` });
    }
    return info.toJSON();
  }

  /**
   * 删除记录操作。
   *
   * @param {*} condition 条件
   * @returns
   * @memberof BaseService
   */
  async Remove(condition) {
    return await this.modal.remove({ ...condition });
  }
  /**
   * 删除记录操作。
   *
   * @param {*} condition 条件
   * @returns
   * @memberof BaseService
   */
  async Delete(condition) {
    return await this.Remove(condition);
  }

}
