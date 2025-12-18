import mongoose from 'mongoose';

const { Schema } = mongoose;

// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

const todoSchema = new Schema({
  //Name
  name: {
    type: String
  }, 

  description: {
    type: String
  },
 
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


export default mongoose.model('Todo', todoSchema);
