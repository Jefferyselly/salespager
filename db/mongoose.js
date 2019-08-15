let mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/intMarketing', {useNewUrlParser: true});
mongoose.connect('mongodb://heroku_505whrjz:559kvdpma08ctq9gnunr30vsvj@ds163517.mlab.com:63517/heroku_505whrjz', {useNewUrlParser: true});

mongoose.set('useCreateIndex', true)
module.exports = {mongoose};

