import jwt from 'jsonwebtoken'
import User from '../model/users.js'

const user = async (token) => {
    try {
        User.findOne({
            username: jwt.verify(token, 'tungmmo').data.username
        }, function (error, obj) {
            return true;
        })
    } catch (error) {
        return false;
    }
}

module.exports = user;