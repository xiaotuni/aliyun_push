import http from 'http';
import Koa from 'koa';
import cfg from './config/index.cfg';
import api from './api/index.api';
import MgDBHelper from './database/MongoDbHelper';
import Utility from './common/Utility';
import middleware from './middleware';

const initStart = async () => {
  try {

    const port = process.env.PORT || 8080;
    const app = new Koa()
    app.keys = ['secret'];
    app.use(middleware());
    app.use(api());
    app.use(async ctx => {
      ctx.status = 404;
      ctx.body = { code: 404, msg: '未找到' };
    });
    app.context.onerror = function (err) {
      if (!err) {
        return;
      }
      Utility.printLog(err);
      const { message } = err || {};

      try {
        this.status = err.status || 500;
        this.body = { msg: message };
        this.res.end(JSON.stringify(this.body));
      } catch (ex) {
        Utility.printLog(ex);
      }
    }

    const serve = http
      .createServer(app.callback())
      .listen(port);

    process.on('SIGINT', () => {
      MgDBHelper.close();
      serve.close(() => {
        setTimeout(() => {
          process.exit(0);
        }, 300);
      });
    });

  } catch (ex) {
    console.log(ex);
  }
}

initStart();

process.on('unhandledRejection', (reason, p) => {
  Utility.printLog(reason, p);
});
