import redis from 'redis';
import bluebird from 'bluebird';
import config from '../config/index.cfg';
import Utility from '../common/Utility';


bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

export function createRedisClient(opt) {
  // const rc = redis.createClient(opt.port, opt.host, opt);
  // rc.on('error', (err) => {
  //   Utility.printLog('Redis Error:', opt.host, err);
  // });

  // rc.on('end', (err) => {
  //   Utility.printLog('Redis end:', opt.host, err);
  // });

  // rc.on('ready', (err) => {
  //   Utility.printLog('Redis ready:', opt.host, err);
  // });

  // return rc;
}

export default createRedisClient(config.redis);
