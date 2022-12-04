import axios from 'axios';
import md5 from 'md5'
import { validationResult } from 'express-validator/check'
import User from '../model/users.js'
import XSS from 'xss'
import jwt from 'jsonwebtoken'


const Signup = async (req, res) => {

    const username = XSS(req.body.username);
    const email = XSS(req.body.email);
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).render('auth/signup', {
            pageTitle: 'Đăng ký',
            errorMessage: errors.array()[0].msg,
            status: 'warning',
            user: false
        });

    }
    else {
        const hashedPassword = md5(password)

        const user = new User({
            username: username,
            email: email,
            password: hashedPassword
        });

        user.save().then(result => {

            res.redirect('/signin');

        });
    }
};

const Signin = async (req, res) => {
    const username = XSS(req.body.username);
    const password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).render('auth/signin', {
            pageTitle: 'Đăng nhập',
            errorMessage: errors.array()[0].msg,
            oldInput: { username, password },
            validationErrors: errors.array(),
            status: 'warning',
            user: false
        });
    }

    User.findOne({ username: username }).then(user => {

        if (md5(password) == user.password) {
            res.cookie('isLoggedIn', true);

            res.cookie('token',jwt.sign(
            {
                data: user
            }, 
            'tungmmo', 
            { 
                expiresIn: '24h' 
            }));

            res.redirect('/')
        }
        else {
            return res.status(400).render('auth/signin', {
                pageTitle: 'Đăng nhập',
                errorMessage: 'Mật khẩu không chính xác',
                status: 'error',
                user: false
            });
        }

    }).catch((err) => {
        console.log(err)
        return res.status(500).send(err)
    });

}
module.exports = {
    Signup,
    Signin
}