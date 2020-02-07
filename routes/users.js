var express = require('express');
var router = express.Router();
var postUser = require('./user_account');
var postVal = require('./models_news');
//npm install multer - MODULE FOR FILE UPLOADS
var multer  = require('multer')

//var upload = multer({ dest: 'public/' })
//var formidable = require('formidable');
var fs = require('fs');
//npm install random-number - MODULE FOR GENERATING RANDOM NUMBERS
var rn = require('random-number');
//npm install rmdir - MODULE FOR DELETING FILES AND DIRECTORIES
var rmdir = require('rmdir');
/**var gen = rn.generator({
  min:  1056890657
, max:  3569875324
, integer: true
})
console.log("RANDOMY = " + gen());
rmdir('public/4', function (err, dirs, files) {
  console.log(dirs);
  console.log(files);
  console.log('all files are removed');
});**/
router.get('/page', function(req, res, next) {
  function setV(politic_RT,sport_RT,other_RT){
		var err = "";
		res.render('adminHome', {errorMesg:err, plolitics_r: politic_RT, sports_r: sport_RT, others_r: other_RT});
	}
	function politics(){
		postVal.findAll({where: { del_status: '0', postType: 'Politics' }, limit: 2, attributes:['id','author','postTitle','postType','postDate','postId','postBody']}).then(politic_R => {
			sports(politic_R);
		  })
	}
	function sports(politic_R){
		postVal.findAll({where: { del_status: '0', postType: 'Sports' }, limit: 2, attributes:['id','author','postTitle','postType','postDate','postId','postBody']}).then(sport_R => {
			others(politic_R,sport_R);
		  })
	}
	function others(politic_R,sport_R){
		postVal.findAll({where: { del_status: '0', postType: 'Others' }, limit: 2, attributes:['id','author','postTitle','postType','postDate','postId','postBody']}).then(other_R => {
			setV(politic_R,sport_R,other_R);
		  })
	}
	politics();
})
//submit log in details
router.post('/page', function(req, res){
	var userP = req.body.userP; var inputUser =  req.body.inputUser;
	
	function verify_All(total_record,politic_RT,sport_RT,other_RT){
		if (total_record.count >=1 ){
			//console.log("ins = " + total_record.count);
			req.session.full_Name = total_record.rows[0].FullName;
			req.session.user_ID = total_record.rows[0].userID;
			//console.log(" cookie - " + req.session.full_Name);
			loadNews(req.session.user_ID,1, res, req.session.full_Name);
			//console.log("ins = " + err);
		}else{
			err ="Error: Invalid User ID Or Password !!!";
			res.render('adminHome', {errorMesg:err, plolitics_r: politic_RT, sports_r: sport_RT, others_r: other_RT});
		}
	}
	function validate(politic_RT,sport_RT,other_RT){
		if(userP=="" || inputUser ==""){
			//err ="Error: Some Values are Empty - Verify !!";
			verify_All(0,politic_RT,sport_RT,other_RT);
		}else{
			postUser.findAndCountAll({where: { userID: inputUser, userPassword: userP }, attributes:['id','userID','userPassword','FullName']}).then(total_record=>{
				verify_All(total_record,politic_RT,sport_RT,other_RT);
			})
		}
	}
	function politics(){
		postVal.findAll({where: { del_status: '0', postType: 'Politics' }, limit: 2, attributes:['id','author','postTitle','postType','postDate','postId','postBody']}).then(politic_R => {
			sports(politic_R);
		  })
	}
	function sports(politic_R){
		postVal.findAll({where: { del_status: '0', postType: 'Sports' }, limit: 2, attributes:['id','author','postTitle','postType','postDate','postId','postBody']}).then(sport_R => {
			others(politic_R,sport_R);
		  })
	}
	function others(politic_R,sport_R){
		postVal.findAll({where: { del_status: '0', postType: 'Others' }, limit: 2, attributes:['id','author','postTitle','postType','postDate','postId','postBody']}).then(other_R => {
			validate(politic_R,sport_R,other_R);
		  })
	}
	politics();
});
router.get('/home', function(req, res, next) {
	if(req.session.full_Name !=="" && req.session.user_ID !==""){
			loadNews(req.session.user_ID,1, res, req.session.full_Name);
	}else{
		res.redirect("/");
	}
})
//load new post 
router.get('/newpost', function(req, res, next) {
	var postType1 = postTitle1 = postBody1 ="";
	if(req.session.full_Name !="" && req.session.user_ID !=""){
		res.render('newpost', {postType: postType1,postTitle: postTitle1,postBody: postBody1, author: req.session.full_Name});
	}else{
		res.redirect("/");
	}
})
//save new post 
router.post('/newpost', function(req, res, next) {
	var postType1 = postTitle1 = postBody1 ="";
	if(req.session.full_Name !=="" && req.session.user_ID !==""){
		//generating news id
		var rand = (rn.generator({ min:  1056890657, max:  3569875324, integer: true})).toString();
		var newsfolder = rand.toString();
		//var newsfolder = 1056890657;
		var destfolder = "public/newsFile/" + newsfolder + "/";
		//create the news folder
		//fs.mkdir(destfolder);
		var ext ="";
		var upload = multer({ dest: destfolder }).single('newsFile');
		upload(req, res, function (err){
			if (err) {
				//unable to Upload FILE
			  console.log(err.message);
			  res.redirect("/staff/1");
			  return
			}
			//console.log('Everything went fine');
			var new_file ="file" ; 
			//verify file extension
			switch (req.file.mimetype) {
                    case 'image/jpeg':
                        ext = '.jpeg';
                        break;
                    case 'image/jpg':
                        ext = '.jpg';
                        break;
             }
			
			fs.rename( destfolder + req.file.filename,destfolder + new_file + '.jpg',function(err) {
				   if (err) {
					  return console.error(err);
				   }
				   console.log("File rename successfully!");
				   var size = Math.ceil(new Number(req.file.size)/1024)
					var size_e = (size > 100) ? "G" : "L";
				   savePostError(res,req,ext,size_e,destfolder,newsfolder,"Error: Unable To Save Retry !!");
			});
		});
	}else{
		res.redirect("/");
	}
})
//when saving post
function savePostError(res,req,ext,size_e, destfolder,newsfolder,error){
	if((ext !=".jpg" && ext !=".jpeg") || size_e =="G") {
		/**fs.unlink(destfolder + 'file.jpg', function(err) {
		   if (err) {
			  return console.error(err);
		   }
		   console.log("File deleted successfully!");
		});**/
		rmdir(destfolder, function (err, dirs, files) {
		  console.log(dirs);
		  console.log(files);
		  console.log('all files are removed');
		});
		error = "Error: Invalid File to Upload (More than 100 and  not jpg or jpeg) !!";
		//console.log(req.body.postBody);
		res.render('newpost', {postType: req.body.postType,postTitle: req.body.postTitle, postBody: req.body.postBody, author: req.session.full_Name,errorMesg:error});
	}else{
		
		if(req.body.postType.trim()=="" || req.body.postTitle.trim()=="" || req.body.postBody.trim()==""){
			//delete file and then the folder
			/**fs.unlink(destfolder + 'file.jpg');
			fs.unlink(destfolder);**/
			rmdir(destfolder, function (err, dirs, files) {
			  console.log(dirs);
			  console.log(files);
			  console.log('all files are removed');
			});
			error = "Error: Some Value are not Provided !!";
			//console.log(req.body.postBody);
			res.render('newpost', {postType: req.body.postType,postTitle: req.body.postTitle, postBody: req.body.postBody, author: req.session.full_Name,errorMesg:error});
		}else{
			var datePost=new Date();
			//save the record
			postVal.create({author: req.session.full_Name,postTitle: req.body.postTitle,postType: req.body.postType,postDate: datePost,postBody: req.body.postBody,postId: newsfolder}).then(john => {
				res.redirect('/home');
			})
		}
	}
}
//load edit post 
router.get('/redit/:id', function(req, res, next) {
	var current_page=1;
	if	( req.params.id != null){
		current_page= req.params.id;
	}else{
		res.redirect("/staff/1");
	}
	if(req.session.full_Name !=="" && req.session.user_ID !==""){
		postVal.findAndCountAll({where: { del_status: '0', postId: current_page,author: req.session.full_Name  }, attributes:['id','author','postTitle','postType','postDate','postId','postBody']}).then(total_record=>{
			if(total_record.count >= 1){
				res.render('edit_post', {title: total_record.rows, author: req.session.full_Name});
			}else{
				res.redirect("/staff/1");
			}
		})
	}else{
		res.redirect("/");
	}
})

//post edit post
router.post('/redit/:id', function(req, res, next) {
	var current_page=1;
	if	( req.params.id != ""){
		current_page= req.params.id;
	}else{
		res.redirect("/staff/1");
	}
	//var userP = req.body.userP; var inputUser =  req.body.inputUser;
	if(req.session.full_Name !=="" && req.session.user_ID !==""){
		var destfolder = "public/newsFile/" + current_page + "/";
		var ext ="";
		var upload = multer({ dest: destfolder }).single('newsFile');
		upload(req, res, function (err){
			if (err) {
				//unable to Upload FILE
			  console.log(err.message);
			  res.redirect("/staff/1");
			  return
			}
			//console.log('Everything went fine');
			var new_file ="file" ; 
			//verify file extension
			switch (req.file.mimetype) {
                    case 'image/jpeg':
                        ext = '.jpeg';
                        break;
                    case 'image/jpg':
                        ext = '.jpg';
                        break;
             }
			
			fs.rename( destfolder + req.file.filename,destfolder + new_file + '.jpg',function(err) {
				   if (err) {
					  return console.error(err);
				   }
				   console.log("File rename successfully!");
				   var size = Math.ceil(new Number(req.file.size)/1024)
					var size_e = (size > 100) ? "G" : "L";
				   editPostError(current_page,res,req,ext,size_e,destfolder,"Error: Unable To Update Retry !!");
			});
			
			//check file size
			//	new_file = (ext!="") ? new_file + ext : editPostError(current_page,res,req,"Error: Invalid File to Upload !!");
			
			//get the file type
			/**console.log("Hey File - " + req.file.originalname);
			console.log("Hey File - " + req.file.mimetype);
			console.log("Hey File - " + req.file.size);
			console.log("Hey New File - " + new_file);
			console.log(req.body);**/
		});
	}else{
		res.redirect("/");
	}
})
//when post has issues
function editPostError(current_page,res,req,ext,size_e, destfolder,error){
	if((ext !=".jpg" && ext !=".jpeg") || size_e =="G") {
		fs.unlink(destfolder + 'file.jpg', function(err) {
		   if (err) {
			  return console.error(err);
		   }
		   console.log("File deleted successfully!");
		});
		error = "Error: Invalid File to Upload (More than 100 and  not jpg or jpeg) !!";
		postVal.findAndCountAll({where: { del_status: '0', postId: current_page,author: req.session.full_Name  }, attributes:['id','author','postTitle','postType','postDate','postId','postBody']}).then(total_record=>{
			if(total_record.count >= 1){
				res.render('edit_post', {title: total_record.rows, author: req.session.full_Name,errorMesg:error});
			}else{
				res.redirect("/staff/1");
			}
		})
	}else{
		res.redirect('/page');
	}
}
function loadNews(userID,pagenum, res, fullName){
	postVal.findAndCountAll({where: { del_status: '0', author: fullName  }, attributes:['id','author','postTitle','postType','postDate','postId','postBody']}).then(total_record=>{
			setV(total_record.count,userID,pagenum, res, fullName);
		})
}
	function setV(tot,userID,pagenum, res, fullName){
			total_record = tot;
			/*console.log(total_record);
			console.log(current_page);*/
			current_page = pagenum;
			var has_previous_page = 0;var has_next_page = 0;
			var limit_record = 4;
			var total_pages = Math.ceil(total_record / limit_record);
			var tot_p =[];
			for (var i=1; i <= total_pages; i++)
			{
				tot_p.push(i);
			}
			var t_offset = (current_page - 1) * limit_record;
			var previous_page = current_page - 1;
			var next_page = current_page + 1;
			
			if (previous_page >= 1){
				has_previous_page = 1;
			}	
			if (next_page <= total_pages){
				has_next_page = 1;
			}
			//Project.findAll({ offset: 5, limit: 5 })
			//console.log(politic_RT);
			postVal.findAll({where: { del_status: '0', author: fullName }, offset: t_offset, limit: limit_record, order: ['id'],  attributes:['id','author','postTitle','postType','postDate','postId','postBody']}).then(sam => {
				res.render('view_edit_post', { title: sam,total_pages: total_pages, current_page: current_page,has_next_page: has_next_page,has_previous_page: has_previous_page,previous_page: previous_page,next_page: next_page,tot_p:tot_p, author: fullName});
		  }).catch(err => {
			res.render('index', { title: err + " - sds" });
		});
	}
router.get('/:id?', function(req, res, next) {
		var current_page=1;
		if	( req.params.id != ""){
			current_page= new Number(req.params.id);
		}else{
			current_page=1;
		}
		//total_record = j.count;
		if(req.session.full_Name !=="" && req.session.user_ID !==""){
			loadNews(req.session.user_ID,current_page, res, req.session.full_Name);
		}else{
			res.redirect("/");
		}
});

router.get('/read/:id?', function(req, res, next) {
		var current_page=1;
		if	( req.params.id != ""){
			current_page= req.params.id;
		}
		if(req.session.full_Name !=="" && req.session.user_ID !==""){
				postVal.findAll({where: { del_status: '0', author: req.session.full_Name, postId:current_page }, limit: 1, order: ['id'],  attributes:['id','author','postTitle','postType','postDate','postId','postBody']}).then(sam => {
					res.render('adminReadpost', { title: sam, author: req.session.full_Name});
			  }).catch(err => {
				//res.render('index', { title: err + " - sds" });
				console.log(err);
				//res.redirect("/");
			});
		}else{
			res.redirect("/");
		}
});

router.get('/remove/:id?', function(req, res, next) {
		var current_page=1;
		if	( req.params.id != ""){
			current_page= req.params.id;
		}
		//console.log(current_page);
		//total_record = j.count;
		//loadNews(userID= "sherif",current_page, res, fullName = "Abdulraheem Sherif Adavuruku");
		
		//Post.update({updatedAt: null,}, {where: {deletedAt: {$ne: null}}});
		if(req.session.full_Name !=="" && req.session.user_ID !==""){
		var fullName = req.session.full_Name;
		postVal.update({del_status: "1",attributes:['id','del_status']},{where: { del_status: '0', author: fullName, postId:current_page }, limit: 1, order: ['id']}).then(sam => {
				//loadNews(req.session.user_ID,1, res, req.session.full_Name);
				res.redirect("/staff/1");
		  }).catch(err => {
			//res.render('index', { title: err + " - sds" });
			console.log(err);
		});
	}else{
		res.redirect("/");
	}
		
});
//for any invalid url

module.exports = router;
