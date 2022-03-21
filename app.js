/**
    * @description      : 
    * @author           : aliou
    * @group            : 
    * @created          : 12/03/2022 - 00:20:30
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 12/03/2022
    * - Author          : aliou
    * - Modification    : 
**/
const express = require('express')
const path = require('path')
let bodyParser = require('body-parser')
const multer = require('multer')
const fileUpload = require('express-fileupload')
const upload = multer({dest: 'images/'})
// on crée l'application express
const app = express()


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(fileUpload())
app.set('views', path.join(__dirname, 'views'));
app.set('views/admin', path.join(__dirname, 'views/admin'));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


//Le serveur écoute sur le prot 3000
app.listen('3000', ()=>{
  console.log('listening on http://localhost:3000')
})

//La page d'acceuil
app.get('/', function(req, res) {
  let Article = require('./models/Article')
  Article.allindex(function(articles){
    res.render('index',{articles: articles})
  })
})

//Fonction pour récuper le nombre de page
//On recupere les total des articles 
//puis on le divise par 9(limit=9)
//On l'ajoute dans un tableau total pour l'envoyer à la view 
function pages(articles){
  let total =[]
  for (let i=0; i<=Math.ceil(articles.length/9); i++){ 
    total.push(i)
  }
  return total 
}
//route vers les articles 
app.get('/articles', (req, res)=>{
  let parametres = req.query
  let page = parametres.page
  let Article = require('./models/Article')
  let offset = (page-1)*9-1
 if (offset <0){
   offset=0
 }
  //La methode paginate permet de paginer les articles par 9.
  Article.paginate(offset,function(articles){
  let total = pages(articles)
    res.render('articles',{articles: articles, total: total})
  }) 
})

//route pour la création d'un article
app.get('/create', function(req, res){
  res.render('admin/create')
})
//Pour envoyer les donnes du formalaire permetant de créer un article(avec la methode post)
app.post('/create', function(req, res){
    let Article = require('./models/Article') 
    let file = req.files.image
    let image_name =file.name
    file.mv('public/images/'+image_name)
    Article.create(req.body.titre, req.body.resume, image_name,req.body.contenu, req.body.auteur, function(){
    })
  res.redirect('admin')
})

//Route pour modifier un article
app.get('/update/:id', (req, res)=>{
  let Article = require('./models/Article')
  Article.find(req.params.id, function(article){
   res.render('admin/update',{article: article})
  })
})



app.post('/update', (req, res)=>{
  let Article = require('./models/Article')
 
  Article.modify(req.body.id,req.body.titre,req.body.resume, req.body.contenu,req.body.auteur,Date(req.body.created_at, 'd:m:Y'), function(){
  })
  res.redirect('admin')
})

//Route pour le detail d'un article
app.get('/show/:id',(req, res) => {
  let Article = require('./models/Article')
  Article.find(req.params.id, function(article){
   res.render('show',{article: article})
  })
})

//Route pour le page contact
app.get('/contact', (req, res)=>{
  res.render('contact')
})

//Route pour le page apropos
app.get('/apropos', (req, res)=>{
  res.render('apropos')
})

//Route pour le page d'acceuil de l'administrateur
app.get('/admin', (req, res)=>{
  let Article = require('./models/Article')
  Article.all(function(articles){
    res.render('admin/index',{articles: articles})
  })
})

//Route pour supprimer un article
app.get('/delete/:id', (req, res)=>{
  let Article = require('./models/Article')
  id = parseInt(req.params.id, 10)
  Article.delete(id, ()=>{
    res.redirect('/admin')
  })
})

module.exports = app