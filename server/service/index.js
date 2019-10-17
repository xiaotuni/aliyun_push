import cfg from "../config/index.cfg";
import MySql_Helper from "../database/MySqlHelper";
import AliYun_Service from "./AliYunService";
import CommParamService from "./CommParamService";
import RedisClientService from "./RedisClientService";
import FlutterService from "./FlutterService";

const MySqlHelper = new MySql_Helper(cfg.mysql);
const AliYunService = new AliYun_Service();

export { MySqlHelper, AliYunService, CommParamService, RedisClientService, FlutterService };
