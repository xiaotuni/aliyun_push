import Utility from './Utility';

const { DataType } = Utility;

/**
 * 验证的字段字典。
 */
const DictField = {
  AppKey: { DataType: DataType.Integer, Rules: [{ msg: 'AppKey不为空', reg: Utility.isEmpty }, { msg: 'AppKey类型不正确(如:1234023)', reg: Utility.isIntNumber }] },
  StartTime: { DataType: DataType.DateTime, Rules: [{ msg: '开始时间不能为空', reg: Utility.isEmpty }, { msg: '开始时间格式不正确(2018-11-01 12:11:10.001)', reg: Utility.isDateByString }] },
  EndTime: { DataType: DataType.DateTime, Rules: [{ msg: '结束时间不能为空', reg: Utility.isEmpty }, { msg: '结束时间格式不正确(2018-11-01 12:11:10.001)', reg: Utility.isDateByString }] },
  PushType: { DataType: DataType.String, Rules: [{ msg: '推送类型不能为空', reg: Utility.isEmpty }, { msg: '推送类型范围不正确', reg: Utility.isObjectValue({ NOTICE: 'NOTICE', MESSAGE: 'MESSAGE' }) }] },
  Page: { DataType: DataType.Integer, Rules: [{ msg: '页码不能为空', reg: Utility.isEmpty }, { msg: '页码类型不正确（如：12）', reg: Utility.isIntNumber }] },
  PageSize: { DataType: DataType.Integer, Rules: [{ msg: '页码大小不能为空', reg: Utility.isEmpty }, { msg: '页码大小类型不正确(如：30)', reg: Utility.isIntNumber }] },
  DeviceId: { DataType: DataType.String, Rules: [{ msg: '设备ID不能为空', reg: Utility.isEmpty }] },
  Target: {
    DataType: DataType.String, Rules: [{ msg: '推送目标类型不能为空', reg: Utility.isEmpty }, {
      msg: '推送目标范围不正确', reg: Utility.isObjectValue({
        1: 'DEVICE', 2: 'ACCOUNT', 3: 'ALIAS', 4: 'TAG', 5: 'ALL'
      })
    }]
  },
  TargetValue: { DataType: DataType.String, Rules: [{ msg: '目标值不能为空', reg: Utility.isEmpty }] },
  Title: { DataType: DataType.String, Rules: [{ msg: '推送标题不能为空', reg: Utility.isEmpty }] },
  Body: { DataType: DataType.String, Rules: [{ msg: '推送内容不能为空', reg: Utility.isEmpty }] },  
  DeviceType: { DataType: DataType.String, Rules: [{ msg: '设备类型不能为空', reg: Utility.isEmpty }, { reg: Utility.isObjectValue({ 1: 'ANDROID', 2: 'iOS', 3: 'ALL' }), msg: '传的值不在有范围内' }] },
  uid: { DataType: DataType.String, Rules: [{ msg: '用户ID不能为空', reg: Utility.isEmpty }] },
  username: { DataType: DataType.String, Rules: [{ msg: '用户名不能为空', reg: Utility.isEmpty }] },
  nickname: { DataType: DataType.String, Rules: [{ msg: '用户昵称不能为空', reg: Utility.isEmpty }] },
  mobile: { DataType: DataType.String, Rules: [{ msg: '手机号不能为空', reg: Utility.isEmpty }, { reg: Utility.isMobilePhone, msg: '手机格式不正确(如:13000100100)' }] },
  appType: { DataType: DataType.String, Rules: [{ msg: '类型不能为空', reg: Utility.isEmpty }, { reg: Utility.isObjectValue({ yfarm: 'yfarm', yunfarm: 'yunfarm' }), msg: '传的值不在有范围内' }] },
  deviceType: { DataType: DataType.String, Rules: [{ msg: '设备类型不能为空', reg: Utility.isEmpty }, { reg: Utility.isObjectValue({ android: 'Android', iOS: 'iOS' }), msg: '传的值不在有范围内' }] },
};

/**
 * 
 * 
 * @export
 * @class CheckInfo
 */
export default class CheckInfo {
  static Get = {
    ListPushRecords: ['AppKey', 'StartTime', 'EndTime', 'PushType', 'Page', 'PageSize'],
    QueryDeviceInfo: ['AppKey', 'DeviceId'],
  }
  /**
   * post 请求要验证的字段。
   */
  static Post = {
    DeviceInfo: ['uid', 'username', 'mobile', 'nickname', 'appType', 'DeviceId', 'deviceType',],
    SendPush: ['AppKey', 'Target', 'TargetValue', 'DeviceType', 'PushType', 'Title', 'Body'],
  }

  /**
   * 数据对象规则验证
   * 
   * @static
   * @param {any} body 要验证的对象
   * @param {any} ruleList 验证规则
   * @returns 
   * @memberof CheckInfo
   */
  static Checked(body = {}, ruleList) {
    const self = this;
    const SuccessInfo = {};
    let isSuccess = true;
    const errList = [];
    if (!Utility.isArray(ruleList)) {
      return { FailInfo: isSuccess ? null : errList.join(';'), SuccessInfo: body || {} };
    }
    ruleList.forEach((field) => {
      Utility.printLog('field:', field);
      const { DataType, Rules: rules } = DictField[field];
      const value = body ? Utility.trim(body[field]) : null;
      let isOk = true;
      const errs = [];
      if (Utility.isArray(rules)) {
        rules.forEach(({ msg, reg }) => {
          if (value !== false) {
            if (!reg(value)) {
              errs.push(msg);
              isOk = false;
            }
          }
        });
        if (isOk) {
          SuccessInfo[field] = self[`ConvertTo${DataType}`](Utility.trim(body[field]));
        } else {
          errList.push(`[${field}]：${errs.join(',')}`);
          isSuccess = false;
        }
      }
    });

    if (isSuccess) {
      Object.keys(body).forEach((field) => {
        if (!SuccessInfo[field]) {
          const { DataType } = DictField[field];
          SuccessInfo[field] = self[`ConvertTo${DataType}`](Utility.trim(body[field]));
        }
      });
    }

    return { FailInfo: isSuccess ? null : errList.join(';'), SuccessInfo };
  }

  static ConvertToString(value) {
    return `${value}`;
  }
  static ConvertToInteger(value) {
    return parseInt(value, 0);
  }
  static ConvertToFloat(value) {
    return value;
  }
  static ConvertToBoolean(value) {
    return Boolean(value);
  }
  static ConvertToObject(value) {
    return value;
  }
  static ConvertToDateTimeByISO601(value) {
    return new Date(value).toISOString();
  }
  static ConvertToDateTime(value) {
    return new Date(value);
  }
}
