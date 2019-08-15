const {mongoose} = require('./../db/mongoose');

let contentSchema = new mongoose.Schema({

	Post : {
		type : String,
		default : " No Entry yet"
	},
	Page : {
		type : String
	}
})

let contentDB = mongoose.model('contentDB',contentSchema);

module.exports = {
	contentDB
}