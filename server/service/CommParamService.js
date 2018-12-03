import crypto from 'crypto';
import cfg from '../config/index.cfg';
import Utility from '../common/Utility';
const { aliyun } = cfg;
const { accessKeyId, secretAccessKey, push } = aliyun;
const { version = '2016-08-01', format = 'JSON', signatureMethod = 'HMAC-SHA1', signatureVersion = '1.0' } = push || {};

export default class CommParamService {

  constructor() {
    this.__InitBaseParams();
  }

  /**
   * 基本参数
   *
   * @memberof CommParamService
   */
  __InitBaseParams() {
    this.ParamMap = {};
    //--公共参数部分。
    this.AddParam('Version', version);
    this.AddParam('Format', format);
    this.AddParam('AccessKeyId', accessKeyId);
    this.AddParam('SignatureMethod', signatureMethod);
    this.AddParam('SignatureVersion', signatureVersion);
    this.AddParam('SignatureNonce', Utility.generateSerNum());  // 随机数
    this.AddParam('Timestamp', new Date().toISOString());       // 时间截
  }

  /**
   * 添加参数
   *
   * @param {*} key
   * @param {*} value
   * @memberof CommParam
   */
  AddParam(key, value) {
    this.ParamMap[key] = value;
    return this;
  }

  /**
   * 参数
   *
   * @param {boolean} [isPop=false]
   * @returns
   * @memberof CommParam
   */
  QueryParams(isPop = false) {
    const map = this.ParamMap;
    const keys = Object.keys(map).sort();
    const keyValues = [];
    keys.forEach((key) => {
      const _value = !!isPop ? this.ConvertToEscape(map[key]) : encodeURIComponent(map[key]);
      keyValues.push(`${key}=${_value}`);
    });
    const qp = keyValues.join('&');
    return qp;
  }

  /**
   * 签名
   *
   * @memberof CommParam
   */
  Signature(Method = 'POST') {
    const privateParams = this.ConvertToEscape(this.QueryParams(true));
    const stringToSign = `${Method.toUpperCase()}&${encodeURIComponent('/')}&${privateParams}`;

    const sign = crypto.createHmac('sha1', `${secretAccessKey}&`.toString('utf-8'))
      .update(stringToSign.toString('utf-8'))
      .digest()
      .toString('base64');
    this.AddParam('Signature', sign);
    return sign;
  }

  /**
   * 值转换
   *
   * @param {*} value
   * @returns
   * @memberof CommParam
   */
  ConvertToEscape(value) {
    return encodeURIComponent(value)
      .replace(/\!/gi, '%21')
      .replace(/\'/gi, '%27')
      .replace(/\(/gi, '%28')
      .replace(/\)/gi, '%29')
      .replace(/\*/gi, '%2A');
  }
}