const {mongoose} = require('./../db/mongoose');

let paymentSchema = new mongoose.Schema({

	
	transactionID : {
		type : String
	},
	body : {
		type : String
	}
	
})

let paymentDB = mongoose.model('paymentDB',paymentSchema);

module.exports = {
	paymentDB
}