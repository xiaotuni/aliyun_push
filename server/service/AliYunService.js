import Utility from "../common/Utility";
import HttpHelper from '../common/HttpHelper';
import { CommParamService, MySqlHelper } from '.';
import cfg from '../config/index.cfg'
const { aliyun } = cfg;
const { push } = aliyun;
const { apnsEnv, url: PushUrl } = push || {};
const { DataType: TypeMap } = Utility;

export default class AliYunService {

  async __SendMsg({ cps, }) {
    cps.Signature();
    const urlParam = cps.QueryParams();
    Utility.printLog(cps.ParamMap, '\r\n', urlParam);
    const result = await HttpHelper.onApiPost(PushUrl, { data: urlParam, headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' } });
    return result;
  }

  /**
   * 接口配置信息
   *
   * @returns
   * @memberof AliYunService
   */
  AliPushApiMap() {
    const DefaultUrl = 'https://m.yfarm.net/';
    return {
      FailureMap: {
        AppNotConfigAndroid: { CN: '没有配置PackageName', EN: 'The PackageName of specified app is not configured.' },
        AppNotConfigIOS: { CN: '没有配置对应环境的证书', EN: 'The Certificate of specified ApnsEnv of the app is not configured.' },
        IosBadgeConflict: { CN: '角标自增与角标数不能同时设置', EN: 'Specified iOSBadge must be null when iOSBadgeAutoIncrement is true.' },
        SmsTemplateNameEmpty: { CN: '短信融合推送时SmsTemplateName不能为空', EN: 'SmsTemplateName can’t be empty when sending sms.' },
        SmsSignNameEmpty: { CN: '短信融合推送时SmsSignName不能为空', EN: 'SmsSignName can’t be empty when sending sms.' },
        SendSpeedNotSupported: { CN: '绑定到设备的alias数目超限', EN: 'SendSpeed is not supported for specified Target.' },
        AliasLimitExceed: { CN: '绑定到设备的alias数目超限', EN: 'The number of aliases bind to the deviceId exceeds.' },
        DeviceLimitExceed: { CN: 'alias绑定的设备数目超限', EN: 'The number of devices bind to the alias exceeds.' },
        'InvalidDeviceType.NotMatch': { CN: 'DeviceType和指定app的类型不匹配', EN: 'Specified DeviceType does no match the app.' },
        'InvalidPayload.BytesExceed': { CN: '消息内容长度超限', EN: 'Specified Payload exceeds the 1800 bytes limit.' },
        'InvalidMessageId.NotFound': { CN: '该MessageId指定的推送任务没有找到，原因可能是该次推送已经推送完毕或者该次推送出现错误或者MessageId有误', EN: 'The specified MessageId is not found.' },
        'InvalidPeriod.ExceedMonth': { CN: '查询的时间段超过了31天', EN: 'The period between specified EndTime and StartTime exceeds 31 days.' },
        'InvalidPeriod.ExceedYear': { CN: '查询的时间段超过了366天', EN: 'The period between specified EndTime and StartTime exceeds 366 days.' },
      },
      Api: {
        Push: {
          Desc: '推送高级接口', HttpMethod: 'post',
          Input: {
            AppKey: { Required: true, Type: TypeMap.Integer, Desc: 'AppKey信息' },
            Target: { Required: true, Type: TypeMap.String, Desc: '推送目标：DEVICE: 设备; ACCOUNT: 账号; ALIAS:别名、TAG:标签推送、ALL:推送给全部设备' },
            TargetValue: { Required: true, Type: TypeMap.String, Desc: '根据Target来设定，多个值使用逗号分隔，最多支持100个。' },
            DeviceType: { Required: true, Type: TypeMap.String, Default: 'ALL', Desc: '设备类型，iOS、ANDROID、ALL：全部类型设备' },
            PushType: { Required: true, Type: TypeMap.String, Desc: '消息:MESSAGE、 通知:NOTICE' },
            Title: { Required: true, Type: TypeMap.String, Desc: '发送的消息的标题' },
            Body: { Required: true, Type: TypeMap.String, Desc: '发送的消息内容' },
            iOSMusic: { Required: false, Type: TypeMap.String, Default: 'default', Desc: '通知声音' },
            iOSBadge: { Required: false, Type: TypeMap.Integer, Desc: 'iOS应用图标右上角角标。注意，若iOSBadgeAutoIncrement设置为True，则此项必须为空' },
            iOSBadgeAutoIncrement: { Required: false, Type: TypeMap.Boolean, Default: true, Desc: '是否开启角标自增功能，默认为False' },
            iOSSilentNotification: { Required: false, Type: TypeMap.Boolean, Default: false, Desc: '开启iOS静默通知' },
            iOSSubtitle: { Required: false, Type: TypeMap.String, Desc: 'iOS通知副标题内容（iOS 10+）' },
            iOSNotificationCategory: { Required: false, Type: TypeMap.String, Desc: '指定iOS通知Category（iOS 10+' },
            iOSMutableContent: { Required: false, Type: TypeMap.Boolean, Desc: '是否使能iOS通知扩展处理（iOS 10+）' },
            iOSExtParameters: { Required: false, Type: TypeMap.Object, Default: { Extras: { url: DefaultUrl } }, Desc: 'iOS通知的扩展属性,iOS 10+ 可以在此指定富媒体推送通知的资源Url' },
            iOSApnsEnv: { Required: false, Type: TypeMap.String, Default: 'DEV', Desc: 'iOS的通知是通过APNs中心来发送的，需要填写对应的环境信息:DEV、 PRODUCT' },
            iOSRemind: { Required: false, Type: TypeMap.Boolean, Desc: '消息推送时设备不在线（既与移动推送的服务端的长连接通道不通），则这条推送会做为通知，通过苹果的APNs通道送达一次。注意：离线消息转通知仅适用于生产环境' },
            iOSRemindBody: { Required: false, Type: TypeMap.String, Desc: 'iOS消息转通知时使用的iOS通知内容，仅当iOSApnsEnv=PRODUCT && iOSRemind为true时有效' },
            AndroidMusic: { Required: false, Type: TypeMap.String, Desc: 'Android通知声音（保留参数，当前暂不起作用）' },
            AndroidOpenType: { Required: false, Type: TypeMap.String, Default: 'APPLICATION', Desc: '点击通知后动作：APPLICATION;ACTIVITY;URL;NONE;' },
            AndroidNotifyType: { Required: false, Type: TypeMap.String, Default: 'BOTH', Desc: '通知的提醒方式,振动:VIBRATE,声音:SOUND,声音和振动:BOTH,静音:NONE' },
            AndroidActivity: { Required: false, Type: TypeMap.String, Default: 'com.ylzx.yfarm', Desc: '设定通知打开的activity，仅当AndroidOpenType="Activity"有效，如：com.ylzx.yfarm.bizactivity' },
            AndroidOpenUrl: { Required: false, Type: TypeMap.String, Default: DefaultUrl, Desc: 'Android收到推送后打开对应的url,仅当AndroidOpenType="URL"有效' },
            AndroidNotificationBarType: { Required: false, Type: TypeMap.Integer, Default: 50, Desc: 'Android自定义通知栏样式，取值：1-100' },
            AndroidNotificationBarPriority: { Required: false, Type: TypeMap.Integer, Default: 2, Desc: 'Android通知在通知栏展示时排列位置的优先级 -2 -1 0 1 2' },
            AndroidNotificationChannel: { Required: false, Type: TypeMap.String, Desc: '设置NotificationChannel参数，具体用途请参考常见问题：Android 8.0以上设备通知接收不到' },
            AndroidExtParameters: { Required: false, Type: TypeMap.Object, Default: { Extras: { url: DefaultUrl } }, Desc: '设定通知的扩展属性。(注意 : 该参数要以 json map 的格式传入,否则会解析出错)' },
            AndroidRemind: { Required: false, Type: TypeMap.Boolean, Default: false, Desc: '推送类型为消息时设备不在线，则这条推送会使用辅助弹窗功能。默认值为False，仅当PushType=MESSAGE时生效' },
            AndroidPopupActivity: { Required: false, Type: TypeMap.String, Desc: '此处指定通知点击后跳转的Activity。注：原AndroidXiaoMiActivity参数已废弃，所有第三方辅助弹窗都由新参数统一支持' },
            AndroidPopupTitle: { Required: false, Type: TypeMap.String, Desc: '辅助弹窗模式下Title内容,长度限制:<16字符（中英文都以一个字符计算）。注：原AndroidXiaoMiNotifyTitle参数已废弃，所有第三方辅助弹窗都由新参数统一支持' },
            AndroidPopupBody: { Required: false, Type: TypeMap.String, Desc: '辅助弹窗模式下Body内容,长度限制:<128字符（中英文都以一个字符计算）。注：原AndroidXiaoMiNotifyBody参数已废弃，所有第三方辅助弹窗都由新参数统一支持。' },
            PushTime: { Required: false, Type: TypeMap.DateTimeByISO601, Desc: '用于定时发送。不设置缺省是立即发送。时间格式按照ISO8601标准表示，并需要使用UTC时间，格式为YYYY-MM-DDThh:mm:ssZ' },
            StoreOffline: { Required: false, Type: TypeMap.Boolean, Default: true, Desc: '离线消息/通知是否保存。若保存，在推送时候用户不在线，在过期时间（ExpireTime）内用户上线时会被再次发送。StoreOffline默认设置为false，ExpireTime默认为72小时。（iOS通知走Apns链路，不受StoreOffline影响）' },
            ExpireTime: { Required: false, Type: TypeMap.DateTimeByISO601, Desc: '离线消息/通知的过期时间，和StoreOffline配合使用，过期则不会再被发送，最长保存72小时。默认为72小时。时间格式按照ISO8601标准表示，并需要使用UTC时间，格式为YYYY-MM-DDThh:mm:ssZ，过期时间不能小于当前时间或者定时发送时间加上3秒（ExpireTime > PushTime + 3秒），3秒是为了冗余网络和系统延迟造成的误差。' },
            SmsTemplateName: { Required: false, Type: TypeMap.String, Desc: '补发短信的模板名，可以在短信模板管理界面获取，是系统分配的名称，而非开发者设置的名字' },
            SmsSignName: { Required: false, Type: TypeMap.String, Desc: '补发短信的签名' },
            SmsParams: { Required: false, Type: TypeMap.String, Desc: '短信模板的变量名值对，格式： key1=value1&key2=value2' },
            SmsDelaySecs: { Required: false, Type: TypeMap.Integer, Desc: '触发短信的延迟时间，秒。推荐设置为 15 秒以上，避免短信和推送的重复' },
            SmsSendPolicy: { Required: false, Type: TypeMap.Integer, Desc: '触发短信的条件：0 推送未收到时触发，1 用户未打开时触发' },
          },
          Success: { MessageId: { Type: TypeMap.Integer } },
        },
        PushNoticeToiOS: {
          Desc: '推消息给iOS设备', HttpMethod: 'post',
          Input: {
            AppKey: { Required: true, Type: TypeMap.Integer, Desc: 'AppKey信息' },
            Target: { Required: true, Type: TypeMap.Integer, Desc: '推送目标：DEVICE: 设备; ACCOUNT: 账号; ALIAS:别名、TAG:标签推送、ALL:推送给全部设备' },
            TargetValue: { Required: true, Type: TypeMap.Integer, Desc: '根据Target来设定，多个值使用逗号分隔，最多支持100个。' },
            ApnsEnv: { Required: true, Type: TypeMap.String, Default: 'DEV', Desc: 'iOS的通知是通过APNS中心来发送的，需要填写对应的环境信,DEV、PRODUCT' },
            Title: { Required: true, Type: TypeMap.Integer, Desc: '发送的消息的标题' },
            Body: { Required: true, Type: TypeMap.Integer, Desc: '发送的消息内容' },
            ExtParameters: { Required: false, Type: TypeMap.Object, Default: { Extras: { url: DefaultUrl } }, Desc: '发送的消息内容' },
          },
          Success: { MessageId: { Type: TypeMap.Integer } },
        },
        PushMessageToiOS: {
          Desc: '推消息给iOS设备', HttpMethod: 'post',
          Input: {
            AppKey: { Required: true, Type: TypeMap.Integer, Desc: 'AppKey信息' },
            Target: { Required: true, Type: TypeMap.Integer, Desc: '推送目标：DEVICE: 设备; ACCOUNT: 账号; ALIAS:别名、TAG:标签推送、ALL:推送给全部设备' },
            TargetValue: { Required: true, Type: TypeMap.Integer, Desc: '根据Target来设定，多个值使用逗号分隔，最多支持100个。' },
            Title: { Required: true, Type: TypeMap.Integer, Desc: '发送的消息的标题' },
            Body: { Required: true, Type: TypeMap.Integer, Desc: '发送的消息内容' },
          },
          Success: { MessageId: { Type: TypeMap.Integer } },
        },
        PushNoticeToAndroid: {
          Desc: '推通知给Android设备', HttpMethod: 'post',
          Input: {
            AppKey: { Required: true, Type: TypeMap.Integer, Desc: 'AppKey信息' },
            Target: { Required: true, Type: TypeMap.Integer, Desc: '推送目标：DEVICE: 设备; ACCOUNT: 账号; ALIAS:别名、TAG:标签推送、ALL:推送给全部设备' },
            TargetValue: { Required: true, Type: TypeMap.Integer, Desc: '根据Target来设定，多个值使用逗号分隔，最多支持100个。' },
            Title: { Required: true, Type: TypeMap.Integer, Desc: '发送的消息的标题' },
            Body: { Required: true, Type: TypeMap.Integer, Desc: '发送的消息内容' },
            ExtParameters: { Required: false, Type: TypeMap.Object, Default: { Extras: { url: DefaultUrl } }, Desc: '自定义的KV结构，供开发者扩展使用，针对Android设备。该参数要以json map的格式传入' },
          },
          Success: { MessageId: { Type: TypeMap.Integer } },
        },
        PushMessageToAndroid: {
          Desc: '推通知给Android设备', HttpMethod: 'post',
          Input: {
            AppKey: { Required: true, Type: TypeMap.Integer, Desc: 'AppKey信息' },
            Target: { Required: true, Type: TypeMap.String, Desc: '推送目标：DEVICE: 设备; ACCOUNT: 账号; ALIAS:别名、TAG:标签推送、ALL:推送给全部设备' },
            TargetValue: { Required: true, Type: TypeMap.Integer, Desc: '根据Target来设定，多个值使用逗号分隔，最多支持100个。' },
            Title: { Required: true, Type: TypeMap.Integer, Desc: '发送的消息的标题' },
            Body: { Required: true, Type: TypeMap.Integer, Desc: '发送的消息内容' },
          },
          Success: { MessageId: { Type: TypeMap.Integer } },
        },
        CancelPush: {
          Desc: '取消某次尚未执行的定时推送任务。', HttpMethod: 'post',
          Input: {
            AppKey: { Required: true, Type: TypeMap.Integer, Desc: 'AppKey信息' },
            MessageId: { Required: true, Type: TypeMap.Integer, Desc: '某次推送任务的MessageId' },
          },
          Success: {},
        },
        QueryAliases: {
          Desc: '查询设备绑定的别名', HttpMethod: 'post',
          Input: {
            AppKey: { Required: true, Type: TypeMap.Integer, Desc: 'AppKey信息' },
            DeviceId: { Required: true, Type: TypeMap.String, Desc: '设备在推送的唯一标示，32位，数字和小写字母组合' },
          },
          Success: {},
        },
        BindAlias: {
          Desc: '绑定别名。注意：一次最多只能绑定10个Alias，绑定别名之后立即生效。', HttpMethod: 'post',
          Input: {
            AppKey: { Required: true, Type: TypeMap.Integer, Desc: 'AppKey信息' },
            DeviceId: { Required: true, Type: TypeMap.String, Desc: '设备在推送的唯一标示，32位，数字和小写字母组合' },
            AliasName: { Required: true, Type: TypeMap.String, Desc: '需要绑定的Alias，一次最多只能绑定10个，多个Alias用逗号分隔，Alias最长128个字节（中文算三个字符），一个设备最多绑定128个别名，一个别名最多允许绑定128个设备' },
          },
          Success: {},
        },
        UnbindAlias: {
          Desc: '解绑别名。注意：解绑别名之后立即生效。', HttpMethod: 'post',
          Input: {
            AppKey: { Required: true, Type: TypeMap.Integer, Desc: 'AppKey信息' },
            DeviceId: { Required: true, Type: TypeMap.String, Desc: '设备在推送的唯一标示，32位，数字和小写字母组合' },
            AliasName: { Required: true, Type: TypeMap.String, Desc: '需要绑定的Alias，一次最多只能绑定10个，多个Alias用逗号分隔，Alias最长128个字节（中文算三个字符），一个设备最多绑定128个别名，一个别名最多允许绑定128个设备' },
            UnbindAll: { Required: false, Type: TypeMap.Boolean, Desc: '是否全部解绑，默认为”false”，如果值为”true”，则解绑一个设备当前绑定的所有别名；如果值为”false”，则解绑”AliasName”指定的别名。' }
          },
          Success: {},
        },
        QueryDevicesByAlias: {
          Desc: '通过别名查询设备列表', HttpMethod: 'post',
          Input: {
            AppKey: { Required: true, Type: TypeMap.Integer, Desc: 'AppKey信息' },
            Alias: { Required: true, Type: TypeMap.String, Desc: '别名，一次仅支持查询一个' },
          },
          Success: { DeviceIds: { DeviceId: [] } },
        },
        QueryTags: {
          Desc: '查询某个对象的TAG列表。', HttpMethod: 'post',
          Input: {
            AppKey: { Required: true, Type: TypeMap.Integer, Desc: 'AppKey信息' },
            ClientKey: { Required: true, Type: TypeMap.String, Desc: '设备或account或alias， 每次只能查询1个clientKey' },
            KeyType: { Required: true, Type: TypeMap.String, Desc: 'ClientKey的类型，DEVICE：是设备，ACCOUNT：是账号，ALIAS：是别名' },
          },
          Success: { TagInfos: { TagInfo: [] } },
        },
        ListTags: {
          Desc: '查询App全部的TAG列表。', HttpMethod: 'post',
          Input: {
            AppKey: { Required: true, Type: TypeMap.Integer, Desc: 'AppKey信息' },
          },
          Success: { TagInfos: { TagInfo: [] } },
        },
        BindTag: {
          Desc: '绑定TAG。注意：TAG绑定在10分钟内生效。', HttpMethod: 'post',
          Input: {
            AppKey: { Required: true, Type: TypeMap.Integer, Desc: 'AppKey信息' },
            ClientKey: { Required: true, Type: TypeMap.String, Desc: '设备或account以及alias，多个key用逗号分隔，最多支持1000个' },
            KeyType: { Required: true, Type: TypeMap.String, Desc: 'ClientKey的类型，DEVICE：是设备，ACCOUNT：是账号，ALIAS：是别名' },
            TagName: { Required: true, Type: TypeMap.String, Desc: '绑定的Tag，多个Tag用逗号分隔，系统总共支持1万个Tag，一次最多能绑定10个Tag' },
          },
          Success: {},
        },
        UnbindTag: {
          Desc: '推送高级接口', HttpMethod: 'post',
          Input: {
            AppKey: { Required: true, Type: TypeMap.Integer, Desc: 'AppKey信息' },
            ClientKey: { Required: true, Type: TypeMap.String, Desc: '设备或account以及alias，多个key用逗号分隔，最多支持1000个' },
            KeyType: { Required: true, Type: TypeMap.String, Desc: 'ClientKey的类型，DEVICE：是设备，ACCOUNT：是账号，ALIAS：是别名' },
            TagName: { Required: true, Type: TypeMap.String, Desc: '绑定的Tag，多个Tag用逗号分隔，系统总共支持1万个Tag，一次最多能绑定10个Tag' },
          },
          Success: {},
        },
        RemoveTag: {
          Desc: '删除TAG。注意：该操作会解除目标TAG与其下所有设备/账号/别名的绑定关系，请谨慎操作', HttpMethod: 'post',
          Input: {
            AppKey: { Required: true, Type: TypeMap.Integer, Desc: 'AppKey信息' },
            TagName: { Required: true, Type: TypeMap.String, Desc: '要删除的Tag名称（单次只能删除一个Tag）' },
          },
          Success: {},
        },
        QueryDevicesByAccount: {
          Desc: '通过账户查询设备', HttpMethod: 'post',
          Input: {
            AppKey: { Required: true, Type: TypeMap.Integer, Desc: 'AppKey信息' },
            Account: { Required: true, Type: TypeMap.String, Desc: '账户，一次仅支持查询一个' },
          },
          Success: { DeviceIds: { DeviceId: [] } },
        },
        QueryDeviceInfo: {
          Desc: '查询设备详情', HttpMethod: 'post',
          Input: {
            AppKey: { Required: true, Type: TypeMap.Integer, Desc: 'AppKey信息' },
            DeviceId: { Required: true, Type: TypeMap.String, Desc: '设备在推送系统中的唯一标识(一次只能查询一个)' },
          },
          Success: {
            DeviceInfo: {
              Account: 'test@aliyun.com',
              Tags: 'test_tag,test_tag2',
              Alias: 'test_alias,test_alias2',
              DeviceId: 'a64ae296f3b04a58a05b30c95f14064e',
              DeviceToken: '5ecc7b4012aaa801b63b9195a05543ccbda6b4930d09629e936e1ac4b762a7df',
              DeviceType: 'iOS',
              Online: false,
              LastOnlineTime: '2018-03-27T02:19:40Z',
              PushEnabled: true
            }
          },
        },
        ListPushRecords: {
          Desc: '查询用户app的推送记录。', HttpMethod: 'post',
          Input: {
            AppKey: { Required: true, Type: TypeMap.Integer, Desc: 'AppKey信息' },
            StartTime: { Required: true, Type: TypeMap.DateTimeByISO601, Desc: '查询的起始时间, ISO-8601格式, 格式为 YYYY-MM-DDThh:mm:ssZ' },
            EndTime: { Required: true, Type: TypeMap.DateTimeByISO601, Desc: '查询的结束时间, ISO-8601格式, 格式为 YYYY-MM-DDThh:mm:ssZ' },
            PushType: { Required: true, Type: TypeMap.String, Default: 'NOTICE', Desc: '查询消息的类型, MESSAGE：表示消息，NOTICE：表示通知' },
            Page: { Required: false, Type: TypeMap.Integer, Default: 1, Desc: '推送记录的当前页数, 默认为1' },
            PageSize: { Required: false, Type: TypeMap.Integer, Default: 50, Desc: '每页的条目，默认值为20, 最大为100' },
          },
          Success: {
            Total: 120,
            Page: 1,
            PageSize: 20,
            MessageInfos: [
              {
                AppKey: 23310806,
                MessageId: '510431',
                Type: 'MESSAGE',
                Title: 'test',
                Body: 'test_body',
                Summary: 'request_summary',
                AppName: 'test_app',
                DeviceType: 'ANDROID',
                PushTime: '2018-04-24T09:39:31Z',
              }]
          },
        },
        QueryPushStatByMsg: {
          Desc: '查询消息维度的推送统计。', HttpMethod: 'post',
          Input: {
            AppKey: { Required: true, Type: TypeMap.Integer, Desc: 'AppKey信息' },
            MessageId: { Required: true, Type: TypeMap.String, Desc: '推送的消息ID，推送之后会返回该ID' },
          },
          Success: {},
        },
        QueryPushStatByApp: {
          Desc: '查询APP维度的推送统计', HttpMethod: 'post',
          Input: {
            AppKey: { Required: true, Type: TypeMap.Integer, Desc: 'AppKey信息' },
            StartTime: { Required: true, Type: TypeMap.String, Desc: '查询的起始时间, ISO-8601格式, 格式为 YYYY-MM-DDThh:mm:ssZ' },
            EndTime: { Required: true, Type: TypeMap.String, Desc: '查询的结束时间, ISO-8601格式, 格式为 YYYY-MM-DDThh:mm:ssZ' },
            Granularity: { Required: true, Type: TypeMap.String, Desc: '返回的数据粒度，HOUR：是小时粒度，DAY：是天粒度。小时粒度允许查24小时内数据，天粒度允许查31内天数据，目前只支持天粒度查询。' },
          },
          Success: { AppPushStats: [] },
        },
        QueryDeviceStat: {
          Desc: '查询App维度的设备统计。目前只支持返回天的数据，天维度最多支持查31天内数据', HttpMethod: 'post',
          Input: {
            AppKey: { Required: true, Type: TypeMap.Integer, Desc: 'AppKey信息' },
            StartTime: { Required: true, Type: TypeMap.DateTimeByISO601, Desc: '查询的起始时间, ISO-8601格式, 格式为 YYYY-MM-DDThh:mm:ssZ' },
            EndTime: { Required: true, Type: TypeMap.DateTimeByISO601, Desc: '查询的结束时间, ISO-8601格式, 格式为 YYYY-MM-DDThh:mm:ssZ' },
            DeviceType: { Required: true, Type: TypeMap.String, Desc: '设备类型，取值范围为:iOS,ANDROID,ALL,' },
            QueryType: { Required: true, Type: TypeMap.String, Desc: '查询的是新增设备数还是历史累计设备数，NEW：是新增设备，TOTAL：是累计设备数' },
          },
          Success: { AppDeviceStats: [] },
        },
        QueryUniqueDeviceStat: {
          Desc: '查询App维度的去重设备统计。目前只支持返回天的数据，天维度最多支持查31天内数据。去重设备统计是以月为周期计数，每个月月初都会清零重新计数', HttpMethod: 'post',
          Input: {
            AppKey: { Required: true, Type: TypeMap.Integer, Desc: 'AppKey信息' },
            Granularity: { Required: true, Type: TypeMap.String, Desc: '按天或者按月查询，DAY或者MONTH。' },
            StartTime: { Required: true, Type: TypeMap.DateTimeByISO601, Desc: '查询的起始时间, ISO-8601格式, 格式为 YYYY-MM-DDThh:mm:ssZ' },
            EndTime: { Required: true, Type: TypeMap.DateTimeByISO601, Desc: '查询的结束时间, ISO-8601格式, 格式为 YYYY-MM-DDThh:mm:ssZ' },
          },
          Success: { AppDeviceStats: [] },
        }
      }
    };
  }

  /**
   * 发送推送
   *
   * @param {*} params
   * @returns
   * @memberof AliYunService
   */
  async SendPush(params) {
    Utility.printLog('params:', params);

    const { Action } = params;
    const { Api } = this.AliPushApiMap();
    const { Input } = Api[Action];
    if (!Input) {
      Utility.throwClientError({ msg: `【${Action}】方法没有找到。` })
    }
    const cps = new CommParamService();
    cps.AddParam('Action', Action);
    const keys = Object.keys(Input);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const { Required, Type, Desc, Default } = Input[key];
      const _value = params[key];
      // Utility.printLog(key, _value, Default);
      if (Required) {
        if (Type === TypeMap.Boolean) {
          if (Utility.isBoolean(_value)) {
            cps.AddParam(key, _value);
          } else if (Utility.isBoolean(Default)) {
            cps.AddParam(key, Default);
          } else {
            Utility.throwClientError({ msg: `${key} 不能为空:${Desc}` });
          }
        } else if (Type === TypeMap.DateTimeByISO601) {
          if (!_value) {
            Utility.throwClientError({ msg: `${key} 不能为空:${Desc}` });
          } else {
            cps.AddParam(key, _value.toISOString().replace(/\.\d\d\d/g, ''));              // 去掉毫秒。
          }
        } else if (_value) {
          cps.AddParam(key, Type === TypeMap.Object ? JSON.stringify(_value) : _value);
        } else if (Default) {
          cps.AddParam(key, Type === TypeMap.Object ? JSON.stringify(Default) : Default);
        } else {
          Utility.throwClientError({ msg: `${key} 不能为空:${Desc}` });
        }
      } else {
        if (Type === TypeMap.Boolean) {
          if (Utility.isBoolean(Default)) {
            cps.AddParam(key, Default);
          }
        } else if (_value) {
          cps.AddParam(key, Type === TypeMap.Object ? JSON.stringify(_value) : _value);
        } else if (Default) {
          cps.AddParam(key, Type === TypeMap.Object ? JSON.stringify(Default) : Default);
        }
      }
    }
    return await this.__SendMsg({ cps });
  }

  /**
   * 推送高级接口
   *
   * @param {*} [params={}]
   * @returns
   * @memberof AliYunService
   */
  async Push(params = {}) {
    // const cps = new CommParamService();
    // cps.AddParam('Action', 'Push')
    //   .AddParam('DeviceType', params.DeviceType || 'iOS')   // iOS、ANDROID、ALL
    //   .AddParam('PushType', params.PushType || 'NOTICE')   // NOTICE:通知、MESSAGE：消息
    //   .AddParam('Target', params.Target || 'ACCOUNT')                                     // 指定帐号,用的是用户ID。
    //   .AddParam('TargetValue', params.TargetValue || '575e53a31e591e0e3c6b4335')
    //   .AddParam('Title', params.Title || '云耕云牧推送标题')
    //   .AddParam('Body', params.Body || `云耕云牧推送内容${Utility.formatDate(new Date().getTime())}`)
    //   // =================iOS==========================
    //   .AddParam('iOSMusic', 'default')
    //   // 与下面 iOSBadgeAutoIncrement 互斥
    //   // .AddParam('iOSBadge', '')
    //   // 是否开启角标自增功能，默认为False，当该项为True时，iOSBadge必须为为空。角标自增功能由推送服务端维护每个设备的角标计数，需要用户使用1.9.5以上版本的sdk，并且需要用户主动同步角标数字到服务端。
    //   .AddParam('iOSBadgeAutoIncrement', true)
    //   // 开启iOS静默通知
    //   // .AddParam('iOSSilentNotification', false)
    //   // iOS通知副标题内容（iOS 10+）
    //   // .AddParam('iOSSubtitle', 'iOS通知副标题内容')
    //   // 指定iOS通知Category（iOS 10+）
    //   // .AddParam('iOSNotificationCategory', '')
    //   // 是否使能iOS通知扩展处理（iOS 10+）
    //   // .AddParam('iOSMutableContent', '')
    //   // iOS通知的扩展属性,iOS 10+ 可以在此指定富媒体推送通知的资源Url: {“attachment”: “https://xxxx.xxx/notification_pic.png"} (注意 : 该参数要以json map的格式传入,否则会解析出错)
    //   .AddParam('iOSExtParameters', JSON.stringify(params.ExtParams || { url: 'https://m.yfarm.net/' }))
    //   // iOS的通知是通过APNs中心来发送的，需要填写对应的环境信息。DEV：表示开发环境 PRODUCT：表示生产环境
    //   .AddParam('iOSApnsEnv', apnsEnv || 'DEV')
    //   // 消息推送时设备不在线（既与移动推送的服务端的长连接通道不通），则这条推送会做为通知，通过苹果的APNs通道送达一次。注意：离线消息转通知仅适用于生产环境
    //   .AddParam('iOSRemind', true)
    //   // iOS消息转通知时使用的iOS通知内容，仅当iOSApnsEnv=PRODUCT && iOSRemind为true时有效
    //   .AddParam('iOSRemindBody', params.RemindBody || params.Body || '云耕云牧推送内容')
    //   // ========================ANDROID============================
    //   // Android通知声音（保留参数，当前暂不起作用）
    //   // .AddParam('AndroidMusic', '')
    //   // 点击通知后动作 APPLICATION：打开应用 默认值；ACTIVITY：打开应用；AndroidActivityURL：打开URL ；NONE：无跳转
    //   .AddParam('AndroidOpenType', params.AndroidOpenType || 'APPLICATION')
    //   // 通知的提醒方式 VIBRATE：振动 默认值; SOUND：声音  ; BOTH：声音和振动 ; NONE：静音
    //   .AddParam('AndroidNotifyType', params.AndroidNotifyType || 'BOTH')
    //   // 设定通知打开的activity，仅当AndroidOpenType="Activity"有效，如：com.alibaba.cloudpushdemo.bizactivity
    //   .AddParam('AndroidActivity', params.AndroidActivity || 'com.ylzx.yfarm')
    //   // Android收到推送后打开对应的url,仅当AndroidOpenType="URL"有效
    //   .AddParam('AndroidOpenUrl', params.AndroidOpenUrl || 'https://m.yfarm.net/')
    //   // Android自定义通知栏样式，取值：1-100
    //   .AddParam('AndroidNotificationBarType', params.AndroidNotificationBarType || '50')
    //   // Android通知在通知栏展示时排列位置的优先级 -2 -1 0 1 2
    //   .AddParam('AndroidNotificationBarPriority', params.AndroidNotificationBarPriority || '2')
    //   // 设置NotificationChannel参数，具体用途请参考常见问题：Android 8.0以上设备通知接收不到
    //   // .AddParam('AndroidNotificationChannel', '')
    //   // 设定通知的扩展属性。(注意 : 该参数要以 json map 的格式传入,否则会解析出错)
    //   .AddParam('AndroidExtParameters', JSON.stringify(params.ExtParams || { url: 'https://m.yfarm.net/' }))
    //   // ====================仅作用于Android辅助弹窗功能================
    //   // .AddParam('AndroidRemind', '')
    //   // .AddParam('AndroidPopupActivity', '')
    //   .AddParam('AndroidPopupTitle', params.AndroidPopupTitle || params.Title || '云耕云牧推送标题')
    //   .AddParam('AndroidPopupBody', params.AndroidPopupBody || params.Body || `云耕云牧推送内容${Utility.formatDate(new Date().getTime())}`)
    //   // ====================推送控制(push control)====================
    //   .AddParam('StoreOffline', true)
    // // .AddParam('PushTime', new Date(new Date().getTime() + 60 * 60 * 1000).toISOString());
    // // 离线消息/通知是否保存。若保存，在推送时候用户不在线，在过期时间（ExpireTime）内用户上线时会被再次发送。StoreOffline默认设置为false，
    // // ExpireTime默认为72小时。（iOS通知走Apns链路，不受StoreOffline影响）
    // // .AddParam('ExpireTime', '') // 不知道为什么这个参数老是说 Specified ExpireTime format is not valid.
    // // .Signature();

    // Utility.printLog(new Date(new Date(cps.ParamMap.Timestamp).getTime() + 60 * 60 * 1000 * 12).toISOString());
    // return await this.__SendMsg({ cps });

    params.Action = 'Push';

  }

  /**
   * 推通知给iOS设备
   *
   * @returns
   * @memberof AliYunService
   */
  async PushNoticeToiOS(params = {}) {
    const cp = new CommParamService();
    cp.AddParam('Action', 'PushNoticeToiOS')
      .AddParam('ApnsEnv', apnsEnv || 'DEV')
      .AddParam('Target', 'ACCOUNT')                                     // 指定帐号,用的是用户ID。
      .AddParam('TargetValue', '575e53a31e591e0e3c6b4335')
      .AddParam('Title', '测试通知标题')
      .AddParam('ExtParameters', JSON.stringify({ url: 'http://m.yfarm.net/#app/home' }))
      .AddParam('Body', `终于成功啦${Utility.formatDate(new Date().getTime())}`);
    // cp.Signature();
    return await this.__SendMsg({ cps: cp });
  }

  /**
   * 推消息给iOS设备
   *
   * @returns
   * @memberof AliYunService
   */
  async PushMessageToiOS() {
    const cp = new CommParamService();
    cp.AddParam('Action', 'PushMessageToiOS')
      .AddParam('Target', 'ACCOUNT')                                     // 指定帐号,用的是用户ID。
      .AddParam('TargetValue', '575e53a31e591e0e3c6b4335')
      .AddParam('Title', 'PushMessageToiOS')
      .AddParam('Body', `PushMessageToiOS${Utility.formatDate(new Date().getTime())}`)
    // .Signature();
    return await this.__SendMsg({ cps: cp });
  }

  /**
   * 推消息给Android设备
   *
   * @returns
   * @memberof AliYunService
   */
  async PushMessageToAndroid(params = {}) {
    const cp = new CommParamService();
    cp.AddParam('Action', 'PushMessageToAndroid')
      // 推送目标：DEVICE:根据设备推送；ACCOUNT:根据账号推送；ALIAS:根据别名推送；TAG:根据标签推送；ALL:推送给全部设备；
      .AddParam('Target', params.Target || 'ACCOUNT')                                     // 指定帐号,用的是用户ID。
      .AddParam('TargetValue', params.TargetValue || '575e53a31e591e0e3c6b4335')
      .AddParam('Title', 'PushMessageToAndroid')
      .AddParam('Body', `Push Message To Android ${Utility.formatDate(new Date().getTime())}`)
    // .Signature();
    return await this.__SendMsg({ cps: cp });
  }

  /**
   * 推通知给Android设备
   *
   * @returns
   * @memberof AliYunService
   */
  async PushNoticeToAndroid(params = {}) {
    const cp = new CommParamService();
    cp.AddParam('Action', 'PushNoticeToAndroid')
      // 推送目标：DEVICE:根据设备推送；ACCOUNT:根据账号推送；ALIAS:根据别名推送；TAG:根据标签推送；ALL:推送给全部设备；
      .AddParam('Target', params.Target || 'ACCOUNT')                                     // 指定帐号,用的是用户ID。
      .AddParam('TargetValue', params.TargetValue || '575e53a31e591e0e3c6b4335')
      .AddParam('Title', 'PushNoticeToAndroid')
      .AddParam('Body', `Push Notice To Android ${Utility.formatDate(new Date().getTime())}`)
      .AddParam('ExtParameters', JSON.stringify(params.ExtParameters || { url: 'https://m.yfarm.net/' }))
    // .Signature();
    return await this.__SendMsg({ cps: cp });
  }

  /**
   * 取消定时推送任务
   *
   * @returns
   * @memberof AliYunService
   */
  async CancelPush(params = {}) {
    const cp = new CommParamService();
    cp.AddParam('Action', 'CancelPush')
      .AddParam('MessageId', params.MessageId)
    // .Signature();
    return await this.__SendMsg({ cps: cp });
  }

  // ============================Alias相关======================
  /**
   * 绑定别名
   *
   * @param {*} [params={}]
   * @returns
   * @memberof AliYunService
   */
  async BindAlias(params = {}) {
    const cps = new CommParamService();
    cps.AddParam('Action', 'BindAlias')
      .AddParam('DeviceId', params.DeviceId)       // 设备在推送的唯一标示，32位，数字和小写字母组合
      .AddParam('AliasName', params.AliasName)     // 需要绑定的Alias，一次最多只能绑定10个，多个Alias用逗号分隔，Alias最长128个字节（中文算三个字符），一个设备最多绑定128个别名，一个别名最多允许绑定128个设备
    return await this.__SendMsg({ cps });
  }

  /**
   * 解绑别名。注意：解绑别名之后立即生效。
   *
   * @param {*} [params={}]
   * @returns
   * @memberof AliYunService
   */
  async UnbindAlias(params = {}) {
    const cps = new CommParamService();
    cps.AddParam('Action', 'UnbindAlias')
      .AddParam('DeviceId', params.DeviceId)       // 设备在推送的唯一标示，32位，数字和小写字母组合
    if (Utility.isBoolean(params.UnbindAll)) {
      cps.AddParam('UnbindAll', params.UnbindAll)  // 是否全部解绑，默认为”false”，如果值为”true”，则解绑一个设备当前绑定的所有别名；如果值为”false”，则解绑”AliasName”指定的别名。
    }
    if (params.AliasName) {
      cps.AddParam('AliasName', params.AliasName)  // 需要绑定的Alias，Alias支持128个字节（中文算3个），当”UnbindAll”为”false”时该字段必须，一次最多解绑10个，多个Alias用逗号分隔
    }
    return await this.__SendMsg({ cps });
  }

  /**
   * 查询别名
   *
   * @param {*} [params={}]
   * @returns
   * @memberof AliYunService
   */
  async QueryAliases(params = {}) {
    const cps = new CommParamService();
    cps.AddParam('Action', 'QueryAliases')
      .AddParam('DeviceId', params.DeviceId)       // 设备在推送的唯一标示，32位，数字和小写字母组合
    return await this.__SendMsg({ cps });
  }

  /**
   * 通过别名查询设备列表
   *
   * @param {*} [params={}]
   * @returns
   * @memberof AliYunService
   */
  async QueryDevicesByAlias(params = {}) {
    const cps = new CommParamService();
    cps.AddParam('Action', 'QueryDevicesByAlias')
      .AddParam('Alias', params.DeviceId)       // 别名，一次仅支持查询一个
    return await this.__SendMsg({ cps });
  }

  // ==========================Tag相关==========================
  /**
   * 绑定TAG
   *
   * @param {*} [params={}]
   * @returns
   * @memberof AliYunService
   */
  async BindTag(params = {}) {
    const cps = new CommParamService();
    cps.AddParam('Action', 'BindTag')
      .AddParam('ClientKey', params.ClientKey) // 设备或account以及alias，多个key用逗号分隔，最多支持1000个
      .AddParam('KeyType', params.KeyType)     // ClientKey的类型，DEVICE：是设备，ACCOUNT：是账号，ALIAS：是别名
      .AddParam('TagName', params.TagName)     // 绑定的Tag，多个Tag用逗号分隔，系统总共支持1万个Tag，一次最多能绑定10个Tag
    return await this.__SendMsg({ cps });
  }

  /**
   * 解绑TAG
   *
   * @param {*} [params={}]
   * @returns
   * @memberof AliYunService
   */
  async UnbindTag(params = {}) {
    const cps = new CommParamService();
    cps.AddParam('Action', 'UnbindTag')
      .AddParam('ClientKey', params.ClientKey) // 设备或account以及alias，多个key用逗号分隔，最多支持1000个
      .AddParam('KeyType', params.KeyType)     // ClientKey的类型，DEVICE：是设备，ACCOUNT：是账号，ALIAS：是别名
      .AddParam('TagName', params.TagName)     // 绑定的Tag，多个Tag用逗号分隔，系统总共支持1万个Tag，一次最多能绑定10个Tag
    return await this.__SendMsg({ cps });
  }

  /**
   * 删除TAG
   *
   * @param {*} [params={}]
   * @returns
   * @memberof AliYunService
   */
  async RemoveTag(params = {}) {
    const cps = new CommParamService();
    cps.AddParam('Action', 'RemoveTag')
      .AddParam('TagName', params.TagName)     // 要删除的Tag名称（单次只能删除一个Tag）
    return await this.__SendMsg({ cps });
  }

  /**
   * 查询TAG
   *
   * @param {*} [params={}]
   * @returns
   * @memberof AliYunService
   */
  async QueryTags(params = {}) {
    const cps = new CommParamService();
    cps.AddParam('Action', 'QueryTags')
      .AddParam('ClientKey', params.ClientKey) // 设备或account或alias， 每次只能查询1个clientKey
      .AddParam('KeyType', params.KeyType)     // ClientKey的类型，DEVICE：是设备，ACCOUNT：是账号，ALIAS：是别名
    return await this.__SendMsg({ cps });
  }

  /**
   * TAG列表
   *
   * @param {*} [params={}]
   * @returns
   * @memberof AliYunService
   */
  async ListTags(params = {}) {
    const cps = new CommParamService();
    cps.AddParam('Action', 'ListTags')
    return await this.__SendMsg({ cps });
  }

  // ==========================Account相关===============================
  /**
   * 通过账户查询设备列表
   *
   * @param {*} [params={}]
   * @returns
   * @memberof AliYunService
   */
  async QueryDevicesByAccount(params = {}) {
    const cps = new CommParamService();
    cps.AddParam('Action', 'QueryDevicesByAccount')
    cps.AddParam('Account', params.Account)  // 账户，一次仅支持查询一个
    return await this.__SendMsg({ cps });
  }

  // ==========================查询与统计===============================
  /**
   * 去重设备统计
   *
   * @param {*} [params={}]
   * @returns
   * @memberof AliYunService
   */
  async QueryUniqueDeviceStat(params = {}) {
    const cps = new CommParamService();
    cps.AddParam('Action', 'QueryUniqueDeviceStat')
    cps.AddParam('Granularity', params.Granularity)  // 按天或者按月查询，DAY或者MONTH
    cps.AddParam('StartTime', params.StartTime)      // 查询的起始时间, ISO-8601格式, 格式为 YYYY-MM-DDThh:mm:ssZ
    cps.AddParam('EndTime', params.EndTime)          // 查询的结束时间, ISO-8601格式, 格式为 YYYY-MM-DDThh:mm:ssZ
    return await this.__SendMsg({ cps });
  }

  /**
   * 设备新增与留存
   *
   * @param {*} [params={}]
   * @returns
   * @memberof AliYunService
   */
  async QueryDeviceStat(params = {}) {
    const cps = new CommParamService();
    cps.AddParam('Action', 'QueryDeviceStat')
    cps.AddParam('StartTime', params.StartTime)      // 查询的起始时间, ISO-8601格式, 格式为 YYYY-MM-DDThh:mm:ssZ
    cps.AddParam('EndTime', params.EndTime)          // 查询的结束时间, ISO-8601格式, 格式为 YYYY-MM-DDThh:mm:ssZ
    cps.AddParam('DeviceType', params.DeviceType)    // 设备类型，取值范围为：    iOS：iOS设备    ANDROID：Andriod设备    ALL：全部类型设备
    cps.AddParam('QueryType', params.QueryType)      // 查询的结束时间, ISO-8601格式, 格式为 YYYY-MM-DDThh:mm:ssZ
    return await this.__SendMsg({ cps });
  }

  /**
   * APP维度推送统计
   *
   * @param {*} [params={}]
   * @returns
   * @memberof AliYunService
   */
  async QueryPushStatByApp(params = {}) {
    const cps = new CommParamService();
    cps.AddParam('Action', 'QueryPushStatByApp')
    cps.AddParam('StartTime', params.StartTime)      // 查询的起始时间, ISO-8601格式, 格式为 YYYY-MM-DDThh:mm:ssZ
    cps.AddParam('EndTime', params.EndTime)          // 查询的结束时间, ISO-8601格式, 格式为 YYYY-MM-DDThh:mm:ssZ
    cps.AddParam('Granularity', params.Granularity)  // 返回的数据粒度，HOUR：是小时粒度，DAY：是天粒度。小时粒度允许查24小时内数据，天粒度允许查31内天数据，目前只支持天粒度查询。
    return await this.__SendMsg({ cps });
  }

  /**
   * 任务维度推送统计
   *
   * @param {*} [params={}]
   * @returns
   * @memberof AliYunService
   */
  async QueryPushStatByMsg(params = {}) {
    const cps = new CommParamService();
    cps.AddParam('Action', 'QueryPushStatByMsg')
    cps.AddParam('MessageId', params.MessageId)      // 查询的起始时间, ISO-8601格式, 格式为 YYYY-MM-DDThh:mm:ssZ
    return await this.__SendMsg({ cps });
  }

  /**
   * 查询推送列表
   *
   * @param {*} [params={}]
   * @returns
   * @memberof AliYunService
   */
  async ListPushRecords(params = {}) {
    // const cps = new CommParamService();
    // cps.AddParam('Action', 'ListPushRecords')
    // cps.AddParam('StartTime', params.StartTime)     // 查询的起始时间, ISO-8601格式, 格式为 YYYY-MM-DDThh:mm:ssZ
    // cps.AddParam('EndTime', params.EndTime)         // 查询的结束时间, ISO-8601格式, 格式为 YYYY-MM-DDThh:mm:ssZ
    // cps.AddParam('PushType', params.PushType)       // 查询消息的类型, MESSAGE：表示消息，NOTICE：表示通知
    // cps.AddParam('Page', params.Page || 1)          // 推送记录的当前页数, 默认为1
    // cps.AddParam('PageSize', params.PageSize || 50) // 每页的条目，默认值为20, 最大为100
    // return await this.__SendMsg({ cps });

    params.Action = 'ListPushRecords';
    return await this.SendPush(params);
  }

  /**
   * 查询设备详情
   *
   * @param {*} [params={}]
   * @returns
   * @memberof AliYunService
   */
  async QueryDeviceInfo(params = {}) {
    // const cps = new CommParamService();
    // cps.AddParam('Action', 'QueryDeviceInfo')
    // cps.AddParam('DeviceId', params.DeviceId)     // 设备在推送系统中的唯一标识(一次只能查询一个)
    // return await this.__SendMsg({ cps });
    params.Action = 'QueryDeviceInfo';
    return await this.SendPush(params);
  }

  async SaveDeviceInfo(params) {
    const { uid, nickname, username, mobile, appType, DeviceId, deviceType } = params;
    let querySql = `select * from device_info t where t.uid='${uid}' and t.deviceId = '${DeviceId}' and t.appType = '${appType}' and t.deviceType = '${deviceType}'`;
    let result = await MySqlHelper.queryOne(querySql);
    Utility.printLog('result:', result);
    querySql = `insert into device_info(uid, nickname, username, mobile, appType, deviceId, deviceType,createTime)values
    ('${uid}', '${nickname}' , '${username}', '${mobile}', '${appType}', '${DeviceId}', '${deviceType}','${Utility.formatDate(new Date().getTime())}')`;
    if (!result) {
      Utility.printLog(querySql);
      result = await MySqlHelper.insertSql(querySql);
    } else {
      result = await MySqlHelper.UpdateSql(`update device_info set updateTime='${Utility.formatDate(new Date().getTime())}', nickname='${nickname}' where uid='${uid}' and deviceId = '${DeviceId}'`)
    }
    return result;
  }
}
