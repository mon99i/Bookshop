const {StatusCodes} = require('http-status-codes');
const conn = require('../mariadb');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto'); // 암호화 모듈
dotenv.config();

const join = (req, res) => {
    const {email, password} = req.body;

    let sql = 'INSERT INTO users (email, password, salt) VALUES (?, ?, ?)';

    // 비밀번호 암호화
    // 회원가입 시 비밀번호 암호화 후 암호화된 비밀번호와 salt 값 같이 저장
    // 로그인 시, salt값 꺼내서 비밀번호 암호화 해보고 DB password와 비교
    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    let values = [email, hashPassword, salt];
    conn.query(sql, values, 
        (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            
            return res.status(StatusCodes.CREATED).json(results);
        })
};

const login = (req, res) => {
    const {email, password} = req.body;

    let sql = 'SELECT * FROM users WHERE email = ?';
    conn.query(sql, email, 
        (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            const loginUser = results[0];

            const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt, 10000, 10, 'sha512').toString('base64');

            if(loginUser && loginUser.password == hashPassword) {
                const token = jwt.sign({
                    id : loginUser.id,
                    email : loginUser.email
                }, process.env.PRIVATE_KEY, {
                    expiresIn : '5m',
                    issuer : "kim"
                });

                res.cookie("token", token, {
                    httpOnly : true
                });
                console.log(token);

                return res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
        }
    )
};

const passwordResetRequest = (req, res) => {
    const {email} = req.body;

    let sql = 'SELECT * FROM users WHERE email = ?';
    conn.query(sql, email,
        (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            const user = results[0];
            if(user) {
                return res.status(StatusCodes.OK).json({
                    email : email
                });
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
        }
    )
};

const passwordReset = (req, res) => { 
    const {email, password} = req.body;

    let sql = 'UPDATE users SET password=?, salt=? WHERE email=?';

    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    let values = [hashPassword, salt, email];
    conn.query(sql, values,
        (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if(results.affectedRows == 0)
                return res.status(StatusCodes.BAD_REQUEST).end();
            else
                return res.status(StatusCodes.OK).json(results);
        }
    )
};

module.exports = {
    join, 
    login, 
    passwordResetRequest, 
    passwordReset
};
