const User = require('../model/User');
const Ip = require('../model/Ip');
const debug = require('debug');

exports.index = function(req, res) {
    res.render('index', {
        title: 'Registration',
    });
};

exports.checkIp = function(req, res) {
    let x = req.ip;   //getting browser's ip address

    Ip.checkIp(x).then(function (response) {
        if (Object.keys(response).length === 0){
            res.status(200).json({
                error: false,
                msg: "Ip will be saved in db",
                captcha: 0
            })
        }else  {
            Ip.checkCount(x).then(function (response) {
                if (response.count <= 2){
                    res.status(200).json({
                        error: false,
                        captcha: 0,
                        msg: 'Count less than 3 so no captcha showed'
                    })
                } else {
                    res.status(200).json({
                        error: false,
                        captcha: 1,
                        msg: 'Captcha to be showed'

                    })
                }
            })
        }
    });
};

exports.registerUser = function (req, res) {

    let x = req.ip;   //getting browser's ip address

    Ip.checkIp(x).then(function (response) {
        if (Object.keys(response).length === 0){
            let ip = new Ip({
                ip: x,
                count: 1,
            });

            ip.save(function (err) {
                if (err) {
                    res.status(500).json({
                        error: true,
                        msg: 'Something went wrong'
                    })
                }else {
                    saveuser(function () {
                        res.status(200).json({
                            error: false,
                            msg: 'Registered Successfully'
                        })
                    })
                }
            })
        } else if(Object.keys(response).length !== 0){
            Ip.checkCount(x).then(function (response) {
                if (response.count <= 2){
                    Ip.addCount(x).then(function () {
                        res.status(200).json({
                            error: false,
                            msg: 'Registered Successfully'
                        })
                    })
                }else{
                    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
                        return res.json({"responseCode" : 1, "responseDesc" : "Please select captcha", "msg": 'Captcha Error'});
                    }
                    // Put your secret key here.
                    var secretKey = "<<put your secret key>>";
                    // req.connection.remoteAddress will provide IP address of connected user.
                    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
                    // Hitting GET request to the URL, Google will respond with success or error scenario.
                    request(verificationUrl,function(error,response,body) {
                        body = JSON.parse(body);
                        // Success will be true or false depending upon captcha validation.
                        if(body.success !== undefined && !body.success) {
                            return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
                        }else {
                            saveuser().then(function () {
                                res.json({"responseCode" : 0,"responseDesc" : "Sucess"});
                            })
                        }
                    });
                }
            })
        }else{

        }

        });

    function saveuser() {
        const user = new User({
            username : req.body.cname,
            email : req.body.email,
            password : req.body.password,
            phone: req.body.phone,
        });


        user.save(function (err) {
            if (err) {
                return res.status(500).json({error: true, errorMessage: err.message, message: "Error saving user"});
            }else {
                return res.status(200).json({error:false, message: "Saved Successfully"})
            }
        })
    }





};


exports.setIpCount = function (req, res) {
    Ip.clearCount().then(function () {
        console.log('This clears the count of IP addresses every day to clear the captcha for first 3 registrations.')
    })

};
