const nodemailer = require('nodemailer')
const {google} = require('googleapis')

const CLIENT_ID = '853949886656-a09ec33df0a9tr6h1vjdsn5rjqae1t9u.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04U9rdXrjqObLCgYIARAAGAQSNwF-L9IrVl5QIX74B755mfRdxo4O1WfTgIUxfY50klQCGxXNa1srarBZxiWdb5a10K7VZ09ATaY'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)

oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})


const sendMail = async ()=>{
    try {
        const access_token = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport(
            {
                service:'gmail',
                auth:{
                    type:'OAuth2',
                    user:'ss365493@gmail.com',
                    clientId:CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken:access_token
                }
            }
        )
        const mailOption = {
            from:'ss365493@gmail.com',
            to:'ss365493@gmail.com',
            subject:'hello world',
            text:'this is hello world',
            html:'<h1 style="color:red"> Chu ho </h1>'
        }
        const result = await transport.sendMail(mailOption)
        return result
    } catch (error) {
        return error
    }
}

sendMail()
.then(result=>console.log(`email sent successfully ${result}`))
.catch(console.log)