import Utility from "../common/Utility";

export default class auth {
  
  async needLog(ctx, next) {
    const { session } = ctx || {};
    const { userInfo } = session || {};
    if (userInfo) {
      return await next();
    }
    Utility.throwClientError({ msg: '请您先登录！' });
  }

  async needAdmin(ctx, next) {
    const { session } = ctx || {};
    const { userInfo } = session || {};
    if (!userInfo) {
      Utility.throwClientError({ msg: '请您先登录！' });
    }
    const { role_type } = userInfo;
    if (role_type !== 1) {
      Utility.throwClientError({ msg: '权限不足' });
    }
    return await next();
  }
}