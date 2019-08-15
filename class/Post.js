const {contentDB} = require('../models/ContentDB');
const _ = require('lodash');

class Posts{

	constructor(){

	}

	store_in_database(req,res){
		//Store posts in the database

		let body = _.pick(req.body,['Post','Page']);

		

		contentDB.findOne({ Page : body.Page}).countDocuments().then((count) => {

			

			if(count < 1){
				console.log(count)

				const new_post = new contentDB(body);

				new_post.save().then((the_post) => {
			res.redirect('/set_about')
		})

			}else{

				contentDB.findOneAndUpdate({Page : body.Page},{$set : {Post : body.Post}}).then((post) => {

					res.redirect('/advertiser')
				})
			}
		})

		


	}

	retrieve_post(req,res){
		commentDB.findOne({}).then((the_post) => {
			res.send(the_post);
		})

	}
}


module.exports = {
	Posts
}