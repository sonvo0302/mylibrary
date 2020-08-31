const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

// module.exports.getUserByID= function(id,callback){
//     User.findById(id,callback);
// }

// module.exports.getUserByEmail=function(txt_email,callback){
//     var query={email:txt_email};
//     User.findOne(query,callback);
// }
// module.exports.comparePassword = function(hashpassword,hash,callback){
//     bcrypt.compare(hashpassword, hash, function(err, isMatch) {
//        callback(null,isMatch);
//     });
// }
// module.exports.createUser=function(newUser,callback){
//     // bcrypt.genSalt(10, function(err, salt) {
//     //     bcrypt.hash(newUser.password, salt, function(err, hash) {
//     //         newUser.password = hash;
           
//     //     });
        
//     // });
//     newUser.save(callback);
// }
