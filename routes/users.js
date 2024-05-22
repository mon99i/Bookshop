const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const {
    join, 
    login, 
    passwordResetRequest, 
    passwordReset
} = require('../controller/user-controller');

router.use(express.json());

router.post('/join', join); // 회원가입
router.post('/login', login); // 로그인
router.post('/reset', passwordResetRequest); // 비밀번호 초기화 요청
router.put('/reset', passwordReset); // 비밀번호 초기화

module.exports = router;