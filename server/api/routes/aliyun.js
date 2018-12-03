import Utility from "../../common/Utility";
import { CommonService, AliYunService } from '../../service';
import CheckInfo from "../../common/CheckInfo";

const __PRE__ = '/aliyun'
export default (router) => {
  router
    .get(`${__PRE__}/listPushRecords`, async ctx => {
      try {
        const { ListPushRecords } = CheckInfo.Get;
        const fieldInfo = CheckInfo.Checked(ctx.query, ListPushRecords);
        const { FailInfo, SuccessInfo } = fieldInfo;
        if (FailInfo) {
          Utility.throwClientError({ msg: FailInfo });
          return;
        }
        ctx.body = await AliYunService.ListPushRecords(SuccessInfo);
      } catch (ex) {
        Utility.clientErrorInfo(ctx, ex);
      }
    })
    .get(`${__PRE__}/queryDeviceInfo`, async ctx => {
      try {
        const { QueryDeviceInfo } = CheckInfo.Get;
        const fieldInfo = CheckInfo.Checked(ctx.query, QueryDeviceInfo);
        const { FailInfo, SuccessInfo } = fieldInfo;
        if (FailInfo) {
          Utility.throwClientError({ msg: FailInfo });
          return;
        }
        // const params = {};
        // params.Action = 'QueryDeviceInfo';
        // params.AppKey = 'AppKey';
        // params.DeviceId = '5d42c0fcad9f496b9a2760c211f0a7e4';// 'c016a905030144cbb84e1083f0f15139','da92566ae4d7480183c258386969e681','5d42c0fcad9f496b9a2760c211f0a7e4'
        ctx.body = await AliYunService.QueryDeviceInfo(SuccessInfo);;
      } catch (ex) {
        Utility.printLog(ex);
        Utility.clientErrorInfo(ctx, ex);
      }
    })
    .post(`${__PRE__}/deviceInfo`, async (ctx) => {
      try {
        const { DeviceInfo } = CheckInfo.Post;
        const fieldInfo = CheckInfo.Checked(ctx.request.body, DeviceInfo);
        const { FailInfo, SuccessInfo } = fieldInfo;
        if (FailInfo) {
          Utility.throwClientError({ msg: FailInfo });
          return;
        }
        // // save device info to db;
        await AliYunService.SaveDeviceInfo(SuccessInfo);

        ctx.body = { msg: 'ok' };
      } catch (ex) {
        Utility.printLog(ex);
        Utility.clientErrorInfo(ctx, ex);
      }
    })
    .post(`${__PRE__}/sendPush`, async (ctx) => {
      try {
        const { SendPush } = CheckInfo.Post;

        const fieldInfo = CheckInfo.Checked(ctx.request.body, SendPush);
        const { FailInfo, SuccessInfo } = fieldInfo;
        if (FailInfo) {
          Utility.throwClientError({ msg: FailInfo });
          return;
        }
        const newParams = Object.assign({}, ctx.request.body, SuccessInfo)
        newParams.Action = 'Push';
        const result = await AliYunService.SendPush(newParams);

        ctx.body = result;
      } catch (ex) {
        Utility.printLog(ex);
        Utility.clientErrorInfo(ctx, ex);
      }
    })
};