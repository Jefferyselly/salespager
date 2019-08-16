const {mongoose} = require('./../db/mongoose');

let paymentSchema = new mongoose.Schema({

	
	reference : {
		type : String
	},
	amount : {
		type : String
	},
	status : {
		type : String
	},
	channel : {
		type : String
	},
	currency : {
		type : String
	}
	
})

let paymentDB = mongoose.model('paymentDB',paymentSchema);

module.exports = {
	paymentDB
}