function registerUser() {


    var data = $("form").serialize();

    if($('#email').val !== '' || $('#password').val !== ''){


        $.ajax({
            type: "POST",
            url: "/postData",
            dataType: "json",
            data: data,
            success: function (response) {
                if(response.msg === 'Captcha Error'){
                    alert('Captcha Error')
                }else {
                    alert('Thank you for registering with us. We will back to you soon');
                    $('#registrationForm')[0].reset();

                }

            },
            error: function (response, err) {
                alert('Oops something went wrong. Please try again')

            }

        })
    }

}

function checkIpCount() {
    $.ajax({
        type: "POST",
        url: "/checkCount",
        dataType: "json",
        success: function (response) {
            console.log(response.captcha);
            if(response.captcha === 1){
                if($('.g-recaptcha').length){
                    console.log('Already exists');
                }else {
                    let captchaLib = "<script src='https://www.google.com/recaptcha/api.js'></script>";

                    $('#titleWeb').append(captchaLib);

                    let div = "<div class='g-recaptcha' data-sitekey='6LfrbKwUAAAAACdkKT6lEyGWRiuITWjkXsxYMInK'></div>";


                    $('#empty').append(div);
                }

            }

        },
        error: function (response, err) {

        }
    })
}
