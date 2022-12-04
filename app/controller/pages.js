import jwt from 'jsonwebtoken'
import User from '../model/users.js'
import accc from './user.js'


// trang lỗi 404
const Error404 = async (req, res) => {
    return res.status(404).render('error/index', {
        pageTitle: 'Lỗi 404 - Trang này không tồn tại'
    });
};

const Home = async (req, res, next) => {
    try {
        User.findOne({
            username: jwt.verify(req.cookies.token, 'tungmmo').data.username
        }, function (error, obj) {
            return res.render('home/index', {
                pageTitle: 'Trang chủ',
                user: obj
            });
        })
    } catch (error) {
        return res.render('home/index', {
            pageTitle: 'Trang chủ',
            user: false
        });
    }

}


const Signup = async (req, res) => {
    return res.render('auth/signup', {
        pageTitle: 'Đăng nhập tài khoản',
        errorMessage: null,
        status: null,
        user: false
    });

};

const Signin = async (req, res) => {

    return res.render('auth/signin', {
        pageTitle: 'Đăng ký tài khoản',
        errorMessage: null,
        status: null,
        user: false
    });
};

module.exports = {
    Error404,
    Home,
    Signup,
    Signin
}