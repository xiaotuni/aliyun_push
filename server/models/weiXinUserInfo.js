const mongoose = require('mongoose');

const { Schema } = mongoose;

const WeiXinUserInfoSchema = new Schema({
  oauth: Boolean,
  openid: String,
  appid: String,
  nickname: String,
  sex: String,
  language: String,
  city: String,
  province: String,
  country: String,
  headimgurl: String,
  unionid: String,
  privilege: Array,
});

export default mongoose.model('WeiXinUserInfo', WeiXinUserInfoSchema);
