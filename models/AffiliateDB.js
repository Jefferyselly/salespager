const {mongoose} = require('./../db/mongoose');

let affiliateSchema = new mongoose.Schema({

	Name : {
		type : String,
		
	},
	Email : {
		type : String
	},
	Password : {
		type : String
	},
	refLink : {
		type : String
	}
})

let affiliateDB = mongoose.model('affiliateDB', affiliateSchema);

module.exports = {
	affiliateDB
}