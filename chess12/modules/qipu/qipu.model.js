import mongoose from 'mongoose';
import { User } from '../user/user.model.js';

const { Schema } = mongoose;

// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

const qipuSchema = new Schema({
  //棋谱标题
  title: {
    type: String
  }, 
  
  //red 红方棋手
  red: {
    type: String
  },
  
  //黑方棋手
  black: {
    type: String
  }, 
  
  //初始局面
  fen: {
    type: String,
	default: "",
  }, 
  
  
  //招法ICCS格式
  moves: {
    type: String,
	default: "",
  },   
  
  //对弈结局， -1，未知；0，红先负；1，红先和；2，红先胜
  result: {
    type: Number,
	default: -1
  }, 

    //步数
  plycount: {
    type: Number,
  }, 
  
  //比赛地点
  site: {
    type: String
  }, 
  
  //赛事名称
  event: {
    type: String
  }, 
  
  //游戏者，实体引用，多值
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
 //这样写应该也行：players:  [Schema.Types.ObjectId]，不过没有指定具体哪个类型

   //其它字段，待加type 类型, ecco 开局分类， author 作者，variation 变例，根据需要后续添加  
  
  created: {
    type: Date,
    default: Date.now,
	index: true
  },  
  updated: {
    type: Date,
    default: Date.now,
	index: true
  }
});


export default mongoose.model('Qipu', qipuSchema);
