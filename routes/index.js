var express = require('express');
var router = express.Router();
//get our db connection file
//var connection = require('./dbconnection'); 
var postVal = require('./models_news');


/* Read News Home. */
router.get('/read/:newsid', function(req, res, next) {
		var newsid="";
		if	( req.params.newsid != ""){
			newsid= req.params.newsid;
		}
		function setV(politic_RT,sport_RT,other_RT){
				//Project.findAll({ offset: 5, limit: 5 })
				//console.log(politic_RT);
				postVal.findAll({where: { del_status: '0', postId: newsid}, order: ['id'],  attributes:['id','author','postTitle','postType','postDate','postId','postBody']}).then(sam => {
					res.render('readNews', { title: sam,category: sam[0].postTitle, plolitics_r: politic_RT, sports_r: sport_RT, others_r: other_RT});
			  }).catch(err => {
				res.render('index', { title: err + " - Fail to Execute" });
			});
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
});
/* Group search page. */
router.get('/viewAll/:category/:id', function(req, res, next) {
	var current_page=1;
	var category="";
		if	( req.params.id != ""){
			current_page= new Number(req.params.id);
			category = req.params.category;
		}
		var total_record=0;
		function setV(tot,politic_RT,sport_RT,other_RT){
				total_record = tot;
				/*console.log(total_record);
				console.log(current_page);*/
				var has_previous_page = 0;var has_next_page = 0;
				var limit_record = 7;
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
				postVal.findAll({where: { del_status: '0', postType: category}, offset: t_offset, limit: limit_record, order: ['id'],  attributes:['id','author','postTitle','postType','postDate','postId','postBody']}).then(sam => {
					res.render('category', { title: sam,total_pages: total_pages, current_page: current_page,has_next_page: has_next_page,has_previous_page: has_previous_page,previous_page: previous_page,next_page: next_page,tot_p:tot_p,plolitics_r: politic_RT, sports_r: sport_RT, others_r: other_RT,category:category});
			  }).catch(err => {
				res.render('index', { title: err + " - Fail to Execute" });
			});
		}
		function politics(tot_rec){
			postVal.findAll({where: { del_status: '0', postType: 'Politics' }, limit: 3, attributes:['id','author','postTitle','postType','postDate','postId','postBody']}).then(politic_R => {
				sports(tot_rec,politic_R);
			  })
		}
		function sports(tot_rec,politic_R){
			postVal.findAll({where: { del_status: '0', postType: 'Sports' }, limit: 3, attributes:['id','author','postTitle','postType','postDate','postId','postBody']}).then(sport_R => {
				others(tot_rec,politic_R,sport_R);
			  })
		}
		function others(tot_rec,politic_R,sport_R){
			postVal.findAll({where: { del_status: '0', postType: 'Others' }, limit: 3, attributes:['id','author','postTitle','postType','postDate','postId','postBody']}).then(other_R => {
				setV(tot_rec,politic_R,sport_R,other_R);
			  })
		}
		
		//console.log("out - " + total_record);
		postVal.findAndCountAll({where: { del_status: '0', postType: category }, attributes:['id','author','postTitle','postType','postDate','postId','postBody']}).then(total_record=>{
			politics(total_record.count);
		})
		//total_record = j.count;
});
router.get('/sam/u', function(req, res){
   if(req.session.page_views){
      req.session.page_views++;
      res.send("You visited this page " + req.session.page_views + " times");
   } else {
      req.session.page_views = 1;
      res.send("Welcome to this page for the first time!");
   }
});
router.get('/users/:userId/books/:bookId', function (req, res) {
  res.send(req.params)
})
/* GET home page. */
router.get('/', function(req, res, next) {
	//next();
	res.redirect('/1');
})
//home page pagination
router.get('/:id?', function(req, res, next) {
		if(req.session.full_Name !=="" && req.session.user_ID !==""){
			req.session.full_Name = "";
			req.session.user_ID ="";
		}
		var current_page = 1;
		//console.log("first , " + current_page);
		if	( req.params.id != null){
			current_page= new Number(req.params.id);
			//console.log("in , " + current_page);
		}else{
			current_page = 1;
			//console.log("not , " + current_page);
		}
		//console.log("hey , " + current_page);
		var total_record=0;
		function setV(tot,topvalue,politic_RT,sport_RT,other_RT){
				total_record = tot;
				/*console.log(total_record);
				console.log(current_page);*/
				var has_previous_page = 0;var has_next_page = 0;
				var limit_record = 10;
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
				postVal.findAll({where: { del_status: '0' }, offset: t_offset, limit: limit_record, order: ['id'],  attributes:['id','author','postTitle','postType','postDate','postId','postBody']}).then(sam => {
					res.render('index', { title: sam,total_pages: total_pages, current_page: current_page,has_next_page: has_next_page,has_previous_page: has_previous_page,previous_page: previous_page,next_page: next_page,tot_p:tot_p,topvalue: topvalue, plolitics_r: politic_RT, sports_r: sport_RT, others_r: other_RT});
			  }).catch(err => {
				res.render('index', { title: err + " - sds" });
			});
		}
		function politics(tot_rec, top_RT){
			postVal.findAll({where: { del_status: '0', postType: 'Politics' }, limit: 5, attributes:['id','author','postTitle','postType','postDate','postId','postBody']}).then(politic_R => {
				sports(tot_rec,top_RT,politic_R);
			  })
		}
		function sports(tot_rec,top_RT,politic_R){
			postVal.findAll({where: { del_status: '0', postType: 'Sports' }, limit: 5, attributes:['id','author','postTitle','postType','postDate','postId','postBody']}).then(sport_R => {
				others(tot_rec,top_RT,politic_R,sport_R);
			  })
		}
		function others(tot_rec,top_RT,politic_R,sport_R){
			postVal.findAll({where: { del_status: '0', postType: 'Others' }, limit: 5, attributes:['id','author','postTitle','postType','postDate','postId','postBody']}).then(other_R => {
				setV(tot_rec,top_RT,politic_R,sport_R,other_R);
			  })
		}
		function getTop(tot_rec){
			postVal.findAll({where: { del_status: '0' }, limit: 5, attributes:['id','author','postTitle','postType','postDate','postId','postBody']}).then(topval => {
				politics(tot_rec, topval);
			  })
		}
		
		
		//console.log("out - " + total_record);
		postVal.findAndCountAll({where: { del_status: '0' }, attributes:['id','author','postTitle','postType','postDate','postId','postBody']}).then(total_record=>{
			getTop(total_record.count);
		})
		//total_record = j.count;
});
		//res.render('index', { title: sam,total_pages: 5, current_page: 5,has_next_page: 5,has_previous_page: 5,previous_page: 5,next_page: 5});
		//return render(request, "myproject/view_edit_post.html", {'sherif' : results, 'fullname' : fullname, 'total_pages' : range(1,total_pages + 1),'total_pages_all' : total_pages,'current_page' : current_page,'has_next_page' : has_next_page,'has_previous_page' : has_previous_page,'previous_page' : previous_page,'next_page' : next_page})




//with parameters - url http://127.0.0.1:3000/users/users/34/books/8989
router.get('/users/:userId/books/:bookId', function (req, res) {
  res.send(req.params)
})

//i.e post user/quotes
router.post('/quotes', (req, res) => {
	if (req.body.first_name =="sherif"){
	res.render('postresult',{firstN:req.body.first_name,lastN:req.body.last_name});
   }else{
	res.send('Invalid User Name or Password')
   }
  // res.send(JSON.stringify(response));
}).get('/quotes', (req, res, next) => {
	res.render('posttest');
})
/**var j = 'public/newsFile/test2';
	fs.mkdir(j,function(err){
	   if (err) {
		  return console.error(err);
	   }
	   console.log("Directory created successfully!");
	});**/
//for any invalid url

module.exports = router;
