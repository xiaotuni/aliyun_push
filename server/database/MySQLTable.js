import Utility from '../common/Utility';

const { MySqlDataType } = Utility;

export default class MySqlTable {
  TableModels = {
    DeviceInfo: {
      UID: { name: 'uid', DataType: MySqlDataType.Varchar, MaxValue: 30 },
      Nickname: { name: 'nickname', DataType: MySqlDataType.Varchar, MaxValue: 50 },
      Username: { name: 'username', DataType: MySqlDataType.Varchar, MaxValue: 20 },
      Mobile: { name: 'mobile', DataType: MySqlDataType.Varchar },
      AppType: { name: 'appType', DataType: MySqlDataType.Varchar },
      Appkey: { name: 'appkey', DataType: MySqlDataType.Varchar },
      DeviceId: { name: 'deviceId', DataType: MySqlDataType.Varchar },
      DeviceType: { name: 'deviceType', DataType: MySqlDataType.Varchar },
      CreateTime: { name: 'createTime', DataType: MySqlDataType.Varchar },
      UpdateTime: { name: 'updateTime', DataType: MySqlDataType.Varchar },
    }
  }
}
