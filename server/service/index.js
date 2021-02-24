import cfg from '../config/index.cfg';
import MySql_Helper from '../database/MySqlHelper';
import CommParamService from './CommParamService';
import RedisClientService from './RedisClientService';

const MySqlHelper = new MySql_Helper(cfg.mysql);

export { MySqlHelper, CommParamService, RedisClientService };
