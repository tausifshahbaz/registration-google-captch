var mongoose = require('mongoose');


var ipSchema = new mongoose.Schema({
    ip: { type: String },
    count:{ type: Number, default: 1 }

},{timestamps: true});

ipSchema.statics.checkIp = function (ip) {
   return this.find({ip: {$exists: true, $in: [ip]}});
};

ipSchema.statics.checkCount = function (ip) {
    return this.findOne({ip: ip})
};

ipSchema.statics.addCount = function (ip) {
    return this.update({ ip : ip}, { $inc : { count: 1}} )
};

ipSchema.statics.clearCount = function () {
    return this.find({}).update({$set:{count: 0}})
};

var Ip = mongoose.model('Ip', ipSchema);

module.exports = Ip;
