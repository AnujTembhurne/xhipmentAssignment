const isValidRequestBody = function(requestBody){
    if(Object.keys(requestBody).length>0)return true
    return false
}

const isValidEmail = function (mail) {
    if (/^[a-z0-9_]{1,}@[a-z]{3,}[.]{1}[a-z]{3,6}$/.test(mail)) {
    return true;
    }
}

const isValidPassword = function (password) {
    if ( /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password)) return true;
  return false
}

module.exports = { isValidRequestBody , isValidEmail, isValidPassword};
