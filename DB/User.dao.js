const mongoose = require('./dbUtlis.js');
const { md5 } = require('../utils/cryptoUrils');
/*
{
	_id:ObjectId,
	u_name:String,
	u_pwd:String,
	u_email:String,
	is_admin:Boolean,
	reg_time:Date,
	login_time:Date,
	login_ip:String,
	id_reg:Boolean // 是否注册成功
}
*/
const Schema = mongoose.Schema({
  u_name: {
    type: String,
    required: true,
    unique: true
  },
  u_pwd: {
    type: String,
    required: true,
    set: md5,
    // get: md5
  },
  u_email: {
    type: String,
    unique: true,
    set: decodeURIComponent,
    // get: decodeURI
  },
  u_img: { // 用户头像
    type: String,
    default: ""
  },
  is_admin: {
    type: Boolean,
    default: false
  },
  id_reg: {
    type: Boolean,
    default: false
  },
  reg_time: {
    type: Date,
    default: Date.now,
  },
  login_time: {
    type: Date,
    default: Date.now
  },
  login_ip: {
    type: String,
    default: null
  }
});


Schema.static('login', async function (doc) {
  // console.log(u_login, u_pwd);
  // console.log(doc);

  const db_res = await this.find({
    $or: [
      { u_name: doc.u_name }, { u_email: doc.u_email }
    ],
    u_pwd: doc.u_pwd
  });

  return db_res && db_res.length && db_res[0];

});

Schema.static('reg', async function (doc) {
  // console.log(u_login, u_pwd);

  const { u_name, u_email } = doc;

  const may_user = await this.findOne({ $or: [{ u_name }, { u_email }] });

  // console.log(may_user);

  if (may_user) {

    return false;
  }
  await doc.save();

  return true;

});

const User = mongoose.model('User', Schema);


module.exports = User;


// const user = new User({
//   u_name: "bucai",
//   u_pwd: "40d628dc4880d42b93972c1e640d301b",
//   u_email: "1234@qq.com",
//   is_admin: true,
// });

// user.save().then((a)=>{
//   console.log(a);
// });

// User.find().then((a)=>{
//   console.log(a);
// });