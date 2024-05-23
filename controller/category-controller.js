const {StatusCodes} = require('http-status-codes');
const conn = require('../mariadb');

const allCategory = (req, res) => {
   
    // 카테고리 목록 조회
    let sql = 'SELECT * FROM category';

    conn.query(sql, (err, results) => {
        if(err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        
        return res.status(StatusCodes.OK).json(results);
    })
};

module.exports = {
    allCategory
};