/**
    * @description      : 
    * @author           : aliou
    * @group            : 
    * @created          : 11/03/2022 - 23:51:04
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 11/03/2022
    * - Author          : aliou
    * - Modification    : 
**/
const mysql = require('mysql')
//On créer une connexion à la base de donnée
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'aliou',
    password: 'diaoaliou',
    database: 'bloggingapp'
});

connection.connect();
module.exports = connection
