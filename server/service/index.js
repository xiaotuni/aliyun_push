import cfg from '../config/index.cfg';
import Common_Service from './CommonService';
import MySql_Helper from '../database/MySqlHelper';
import AliYun_Service from './AliYunService';
import CommParamService from './CommParamService';
import RedisClientService from './RedisClientService';

const CommonService = new Common_Service();
const MySqlHelper = new MySql_Helper(cfg.mysql);
const AliYunService = new AliYun_Service();

export {
  MySqlHelper, AliYunService, CommonService, CommParamService, RedisClientService
}