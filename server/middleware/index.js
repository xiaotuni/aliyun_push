import compose from 'koa-compose';
import convert from 'koa-convert';
import helmet from 'koa-helmet';
import cors from 'koa-cors';
import bodyParser from 'koa-bodyparser';
import session from 'koa-generic-session';
import redisStore from 'koa-redis';
import config from '../config/index.cfg';
import { RedisClientService } from '../service';
import Utility from '../common/Utility';

const { sessionSecret } = config;

function setcookie(req, name, val, secret, options) {
  req.cookies.set(name, val, options);
}

function AccessToken(opt) {
  const option = { name: 'token', secret: '', ...opt, };

  return async (ctx, next) => {
    let accessToken = ctx.query.access_token;
    const authorization = ctx.get('Authorization');
    if (!accessToken && !!authorization && authorization.indexOf('token') !== -1) {
      const tokenBeginIndex = authorization.indexOf('token');
      accessToken = authorization.substr(tokenBeginIndex + 6);
    }
    
    Utility.printLog('==accessToken:', accessToken);
    if (accessToken) {
      ctx.sessionId = accessToken;
      setcookie(ctx, option.name, accessToken, option.secret, {});
    }
    await next();
  };
}

export default function middleware() {
  return compose([
    convert(helmet()), // reset HTTP headers (e.g. remove x-powered-by)
    convert(cors({
      origin: (request) => {
        const origin = request.get('Origin');
        if (process.env.NODE_ENV !== 'production') {
          return origin;
        } else {
          if (origin && (/(\.yfarm\.net)($|:[0-9]*$)/.test(origin)
            || (/(localhost)($|:[0-9]*$)/.test(origin))
            || (/(127\.0\.0\.1)($|:[0-9]*$)/.test(origin)))) {
            return origin;
          }
          return 'http://m.yfarm.net';
        }
      },
    })),
    convert(bodyParser()),
    AccessToken({ name: 'token', secret: sessionSecret }),
    convert(session({ prefix: 'sid:', store: redisStore({ client: RedisClientService }) })),
  ]);
}
