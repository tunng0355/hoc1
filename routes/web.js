import express from 'express'
import { check, body } from 'express-validator/check'


import Pages from '../app/controller/pages.js'
import API from '../app/controller/api.js'

import User from '../app/model/users.js'
import AuthMiddleware from '../app/middleware/user.js'

const router = express.Router()


router.get('/signup', AuthMiddleware,Pages.Signup)
router.get('/signin', AuthMiddleware,Pages.Signin)

router.post('/signin', [
    check('username').isLength({
        min: 3
    }).withMessage('Địa chỉ email hoặc tên đăng nhập không hợp lệ.').custom((value, { req }) => {
        return User.findOne({
            email: value
        }).then(user => {
            if (!user) {
                return User.findOne({
                    username: value
                }).then(user2 => {
                    if (!user2) {
                        return Promise.reject(
                            'Tên đăng nhập hoặc địa chỉ email không tồn tại.'
                        );
                    }
                });
            }
        });
    }),
    body(
        'password',
        'Mật khẩu không hợp lệ.'
    ).isLength({
        min: 3
    }).trim()
], API.Signin);


router.post('/signup', [
    check('username').trim().custom((value, { req }) => {
        return User.findOne({
            username: value
        }).then(user => {
            if (user) {
                return Promise.reject(
                    'Tên đăng nhập đã tồn tại.'
                );
            }
        });
    }),
    check('email')
        .isEmail()
        .withMessage('Địa chỉ email không hợp lệ.')
        .custom((value, { req }) => {
            return User.findOne({
                email: value
            }).then(user => {
                if (user) {
                    return Promise.reject(
                        'Địa chỉ email đã tồn tại.'
                    );
                }
            });
        })
        .normalizeEmail(),
    body(
        'password',
        'Mật khẩu phải có 3 ký tự trở lên.'
    )
        .isLength({
            min: 3
        })
        .trim(),
    body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Mật khẩu xác nhận không chính xác.');
            }
            return true;
        })
], API.Signup);

router.get('/', Pages.Home);
router.get('*', Pages.Error404);


module.exports = router;

