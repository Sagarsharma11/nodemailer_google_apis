const nodemailer = require('nodemailer')
require('dotenv').config();

let transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'sagarsharmatech00@gmail.com',
        pass:process.env.password
    }
})

let mailOption = {
    from:'sagarsharmatech00@gmail.com',
    to:'ss365493@gmail.com',
    subject:'Test mail',
    text:'read and reply this mail'
}

transport.sendMail(mailOption, (err,info)=>{
    if(err){
        console.log(err)
    }else{
        console.log('Email sent ',info.response)
    }
})