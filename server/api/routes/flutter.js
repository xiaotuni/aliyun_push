import Utility from "../../common/Utility";
import { AliYunService, FlutterService } from "../../service";

const __PRE__ = "/flutter";
export default router => {
  router
    .get(`${__PRE__}/demo`, async ctx => {
      try {
        ctx.body = { msg: "hello world", name: `你输入的是【 ${ctx.query.name} 】 ${new Date().toLocaleDateString()}`, query: ctx.query, param: ctx.params };
      } catch (ex) {
        Utility.clientErrorInfo(ctx, ex);
      }
    })
    .post(`${__PRE__}/demo`, async ctx => {
      try {
        ctx.body = { msg: "post 请求回来的数据", name: `你post请求传入的值是【 ${ctx.query.name} 】 ${new Date().toLocaleDateString()}`, body: ctx.request.body, query: ctx.query, param: ctx.params };
      } catch (ex) {
        Utility.clientErrorInfo(ctx, ex);
      }
    })
    .get(`${__PRE__}/demo/:id`, async ctx => {
      try {
        ctx.body = { msg: "hello world", query: ctx.query, param: ctx.params };
      } catch (ex) {
        Utility.clientErrorInfo(ctx, ex);
      }
    })
    .get(`${__PRE__}/pushNoticeToiOS`, async ctx => {
      try {
        // ctx.body = await AliYunService.PushNoticeToiOS();
        const params = {};
        params.Action = "PushNoticeToiOS";
        params.AppKey = "AppKey";
        params.Target = "ACCOUNT";
        params.TargetValue = "575e53a31e591e0e3c6b4335";
        params.Title = "标题";
        params.Body = "推送内容了";
        params.ExtParameters = { Extras: { url: "http://www.baidu.com/", url2: "http://www.qq.com/" } };
        ctx.body = await AliYunService.SendPush(params);
      } catch (ex) {
        Utility.clientErrorInfo(ctx, ex);
      }
    })
    .get(`${__PRE__}/pushMessageToiOS`, async ctx => {
      try {
        // ctx.body = await AliYunService.PushMessageToiOS();
        const prams = {};
        params.Action = "PushMessageToiOS";
        params.AppKey = "AppKey";
        params.Target = "ACCOUNT";
        params.TargetValue = "575e53a31e591e0e3c6b4335";
        params.Title = "Message标题";
        params.Body = "Message推送内容了";
        ctx.body = await AliYunService.SendPush();
      } catch (ex) {
        Utility.clientErrorInfo(ctx, ex);
      }
    })
    .get(`${__PRE__}/pushAdvanced`, async ctx => {
      try {
        ctx.body = await AliYunService.PushAdvanced({ TargetValue: "580867d0d966328e6f922d96,575e53a31e591e0e3c6b4335" });
      } catch (ex) {
        Utility.clientErrorInfo(ctx, ex);
      }
    })
    .get(`${__PRE__}/sendPush`, async ctx => {
      try {
        const params = {};
        params.Action = "Push";
        params.AppKey = "AppKey";
        params.PushType = "NOTICE";
        params.Target = "ACCOUNT";
        params.TargetValue = "575e53a31e591e0e3c6b4335";
        params.Title = "标题";
        params.Body = "推送内容了";
        ctx.body = await AliYunService.SendPush(params);
      } catch (ex) {
        Utility.clientErrorInfo(ctx, ex);
      }
    })
    .get(`${__PRE__}/queryUniqueDeviceStat`, async ctx => {
      try {
        const params = {};
        params.Action = "QueryUniqueDeviceStat";
        params.AppKey = "AppKey";
        params.Granularity = "DAY";
        const current = new Date();
        current.setMonth(current.getMonth() - 1);
        params.StartTime = current;
        params.EndTime = new Date();
        ctx.body = await AliYunService.SendPush(params);
      } catch (ex) {
        Utility.clientErrorInfo(ctx, ex);
      }
    })
    .get(`${__PRE__}/queryDevicesByAccount`, async ctx => {
      try {
        const params = {};
        params.Action = "QueryDevicesByAccount";
        params.AppKey = "AppKey";
        params.Account = "575e53a31e591e0e3c6b4335";
        ctx.body = await AliYunService.SendPush(params);
      } catch (ex) {
        Utility.clientErrorInfo(ctx, ex);
      }
    })
    .get(`${__PRE__}/queryDeviceInfo`, async ctx => {
      try {
        const params = {};
        params.Action = "QueryDeviceInfo";
        params.AppKey = "AppKey";
        params.DeviceId = "5d42c0fcad9f496b9a2760c211f0a7e4"; // 'c016a905030144cbb84e1083f0f15139','da92566ae4d7480183c258386969e681','5d42c0fcad9f496b9a2760c211f0a7e4'
        ctx.body = await AliYunService.SendPush(params);
      } catch (ex) {
        Utility.clientErrorInfo(ctx, ex);
      }
    })
    .post(`${__PRE__}/home`, async ctx => {
      try {
        const data = {
          slides: await FlutterService.slides(),
          categoryItems: await FlutterService.categoryItems(),
          shopInfo: await FlutterService.shopInfo(),
          recommendList: await FlutterService.recommendList(),
          banner: await FlutterService.banner()
        };

        ctx.body = data;
      } catch (ex) {
        Utility.clientErrorInfo(ctx, ex);
      }
    });
};
