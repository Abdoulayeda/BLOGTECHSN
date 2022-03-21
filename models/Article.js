/**
    * @description      : 
    * @author           : aliou
    * @group            : 
    * @created          : 12/03/2022 - 00:08:22
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 12/03/2022
    * - Author          : aliou
    * - Modification    : 
**/
let connection = require('../config/db')
//moment permet de formater les dates
let moment = require('moment')



class Article{

    constructor(row){
        this.row = row
    }

    get id(){
        return this.row.id
    }
    get titre(){
        return this.row.titre
    }
    get auteur(){
        return this.row.auteur
    }
    get contenu(){ 
        return this.row.contenu 
    }
    get resume(){
        return this.row.resume
    }
    get image(){
        return this.row.image
    }
    get created_at(){
        return moment(this.row.created_at)
    }
    get updated_at(){
        return moment(this.row.updated_at)
    }


  
    //Methode pour créer un article
    static create(titre, resume, image, contenu, auteur, cb) {
        connection.query('INSERT INTO articles SET titre = ?, resume = ?, image =?, contenu = ?, auteur = ?, created_at=?, updated_at = ?', [titre, resume, image, contenu, auteur,new Date(), new Date()],(err, result) => {
            if (err) throw err
            cb(result)
        })
    }

    //Methode pour recupérer tout les articles
    static all(cb){
        connection.query('SELECT * FROM articles ORDER BY id DESC ', function(err, rows){
            if (err) throw err
            cb(rows.map((row)=> new Article(row)))
        })
    }

    //Methode pour la pagination
    static paginate(offset ,cb){
        connection.query('SELECT * FROM articles  LIMIT 9 OFFSET ?', [offset], function(err, rows){
            if (err) throw err
            cb(rows.map((row)=> new Article(row)))
        })
    }

    //Methode pour recupérer les quatre dernières articles
    static allindex(cb){
        connection.query('SELECT * FROM articles ORDER BY id DESC LIMIT 4 ', function(err, rows){
            if (err) throw err
            cb(rows.map((row)=> new Article(row)))
        })
    }

   //Methode pour recupérer un article
    static find(id, cb){
        connection.query('SELECT * FROM articles WHERE id = ?',[id], (err, rows)=>{
         if (err) throw err
         cb(new Article(rows[0])); 
        })
    }

    static modify(id,titre,resume,contenu,auteur,created_at,cb){
        connection.query('UPDATE articles SET titre=?,resume=?,contenu =?,auteur=?,created_at=?,updated_at=? WHERE id=?',[titre,resume,contenu,auteur,new Date(created_at),new Date(),id], (err, results)=>{
         if(err) throw err
         cb(results)
        })
    }
    
    //Methode pour supprimer un article
    static delete(id,cb) {
        connection.query('DELETE  FROM articles WHERE id = ?',[id], (err, results)=> {
            if(err) throw err
            cb(results)
        })
    }

}

//Permet de formater les date en français
moment.locale('fr');

module.exports = Article
