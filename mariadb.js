
const mariadb = require('mysql2');

const connection = mariadb.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'root',
        database : 'Bookshop',
        dateStrings : true
    });

module.exports = connection;


// const mariadb = require('mysql2/promise');

// const connection = async () => {
//     const conn = await mariadb.createConnection({
//         host : 'localhost',
//         user : 'root',
//         password : 'root',
//         database : 'Bookshop',
//         dateStrings : true
//     });

//     return conn;
// }

// module.exports = connection;
