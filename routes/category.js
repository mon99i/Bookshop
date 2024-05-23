const express = require('express');
const router = express.Router();
const { 
    allCategory
} = require('../controller/category-controller');

router.use(express.json());

router.get('/', allCategory); // 카테고리 목록 조회

module.exports = router;