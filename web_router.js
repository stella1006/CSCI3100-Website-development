var express = require('express');
var model = require('./model');
var config = require('./config')
var router = express.Router();

var user = model.user;
var planner = model.planner;
var menu = model.menu;
var recipe = model.recipe;
var comment = model.comment;
var browser = model.browser;

var multer = require('multer');
var path = require('path');
var store = path.join(config.dirname,'public','image','recipe');
var storage = multer.diskStorage({destination: function(req,file,cb){
                                    cb(null,store);
                                },
                                filename: function(req,file,cb){
                                    cb(null,file.originalname);
                                }});
var upload = multer({storage: storage});

router.get('/signup', user.showSignUp);                     // show signup page
router.post('/signup', user.signUp);                        // method post to upload signup info

router.get('/login', user.showLogin);
router.post('/login', user.login);

router.get('/logout', user.showLogin);                      // tell backend to logout

router.get('/user/favorite/menu', user.mShowFavorite);      // show favortie page of menu
router.get('/user/favorite/recipe', user.rShowFavorite);    // show favorite page of recipe
router.get('/user/rcm', user.showRcm);
router.get('/user/setting', user.showSetting);              // show setting page
router.post('/user/setting',user.editSetting);              // method post to update setting
router.post('/user/icon',upload.single('setNewPhoto'),user.uploadIcon);                  // method post to udpdate icon
router.get('/user', user.showUserpage);                     // show user page
router.post('/user', user.editUserInfo);                     // method post to update userInfo

// :rid means a variable. Will be offered by backend
router.post('/recipe/:rid/reply', recipe.reply);            // method post to reply
router.get('/recipe/:rid/like', recipe.like);               // tell backend to add like
router.get('/recipe/:rid/dlike', recipe.dlike);             // tell backend to add delike
router.get('/recipe/:rid/edit', recipe.showEditRecipe);     // show edit page
var uploads = upload.any();
router.post('/recipe/:rid/edit', function(req,res,next){
    uploads(req,res,function(err){
        recipe.editRecipe(req,res);
    });
});                                                         // method post to upload new info
router.get('/recipe/:rid', recipe.showRecipe);              // show recipe page
router.get('/recipe/create', recipe.showNewRecipe);         // show creating page
router.post('/recipe/create',function(req,res,next){
    uploads(req,res,function(err){
        recipe.newRecipe(req,res);
    });
});             // method post to upload new recipe
router.get('/search/recipe', browser.searchr);

router.post('/menu/:mid/reply', menu.reply);
router.get('/menu/:mid/like', menu.like);
router.get('/menu/:mid/dlike', menu.dlike);
router.get('/menu/:mid', menu.showMenu);
router.post('/menu/create', planner.newMenu);
router.get('/search/menu', browser.searchm);

router.get('/planner/add/:rid', planner.addRecipe);
router.get('/planner/madd/:mid', planner.addRecipeByMenu);
router.get('/planner/delete/:rid', planner.deleteRecipe);
router.get('/planner', planner.show);
router.get('/planner/clear',planner.clear);

router.get('/explore',user.showRcm);
router.get('/explore/category/recipe',function(req,res){
    browser.category(req,res,'recipe');
});
router.get('/explore/category/menu',function(req,res){
    browser.category(req,res,'menu');
});
router.get('/index',function(req,res){
    res.render('index');
});
router.get('/create',function(req,res){
    res.render('editRecipe');
});
router.get('/procedure',function(req,res){
    res.render('procedure');
});
router.get('/', model.homepage);
router.get('*',function(req,res,next){
    res.send('bad gate way');
});

module.exports = router;
