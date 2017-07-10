const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    openId:{ type: String },
    nickname: { type: String },
    unionid: { type: String },
    headimgurl: { type: String },
  },
  {timestamps: true}
)

module.exports = mongoose.model('User', UserSchema)
