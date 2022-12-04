import data from '../controller/user.js'

const Auth = async (req, res, next) => { 
  
    if (req.cookies.token && req.cookies.isLoggedIn) { 
        if (req.cookies.isLoggedIn == 'true') {
            if(data(req.cookies.token).user != false){
              res.redirect('/')
            }
        } 
    }
    next();
}

module.exports = Auth;