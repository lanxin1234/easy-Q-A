exports.showIndex = function(req,res){
	res.render("index" , {
		"locate" : "index" , 
		"title" : "首页",
		"login" : req.session.login
	});
}
 