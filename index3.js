const { google } = require('googleapis');
const nodemailer = require('nodemailer')

const CLIENT_ID = '853949886656-a09ec33df0a9tr6h1vjdsn5rjqae1t9u.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04U9rdXrjqObLCgYIARAAGAQSNwF-L9IrVl5QIX74B755mfRdxo4O1WfTgIUxfY50klQCGxXNa1srarBZxiWdb5a10K7VZ09ATaY'

let toList = []

// Set up OAuth2 client
const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

// Set the refresh token for the client
oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN
});

// Set up Gmail API client with OAuth2 authentication
const gmail = google.gmail({
    version: 'v1',
    auth: oauth2Client
});

// Use the Gmail API client to fetch messages
gmail.users.messages.list({
    userId: 'ss365493@gmail.com',
    q: 'is:unread'
}, (err, res) => {
    if (err) {
        console.log('The API returned an error:', err);
        return;
    }

    const messages = res.data.messages;

    if (!messages) {
        console.log('No unread messages found.');
        return;
    }

    // Iterate through each message and fetch its details
    let count = 0;
    messages.forEach(message => {
        count++;
        if (count > 1) {
            return 0
        }
        gmail.users.messages.get({
            userId: 'me',
            id: message.id
        }, (err, res) => {
            if (err) {
                console.log('The API returned an error:', err);
                return;
            }
            const headers = res.data.payload.headers;
            let from = headers.find(header => header.name === 'From').value;
            const match = from.match(/(?<=<).*?(?=>)/);
            from = match ? match[0] : header.value;

            if (from == "sagarsharmatech00@gmail.com") {
                const body = res.data.snippet;

                const subject = headers.find(header => header.name === 'Subject').value;
                const date = headers.find(header => header.name === 'Date').value;

                console.log(`Subject: ${subject}`);
                console.log(`From: ${from}`);
                console.log(`Date: ${date}`);
                console.log(`\nmessage => ${body}`)
                toList.push(...[from])
                console.log(toList)

                const sendMail = async (mail) => {
                    try {
                        console.log('running', mail)
                        const access_token = await oauth2Client.getAccessToken()
                        const transport = nodemailer.createTransport(
                            {
                                service: 'gmail',
                                auth: {
                                    type: 'OAuth2',
                                    user: 'ss365493@gmail.com',
                                    clientId: CLIENT_ID,
                                    clientSecret: CLIENT_SECRET,
                                    refreshToken: REFRESH_TOKEN,
                                    accessToken: access_token
                                }
                            }
                        )

                        const mailOption = {
                            from: 'ss365493@gmail.com',
                            to: mail,
                            subject: 'this is test',
                            text: 'auto resopnse ',
                            html: '<h1 style="color:red"> Chu ho </h1>'
                        }
                        const result = await transport.sendMail(mailOption)
                        return result
                    } catch (error) {
                        return error
                    }
                }
                sendMail(from)
                .then(result => console.log(`email sent successfully ${result}`))
                .catch(console.log)
                // const multimail = async () => {
                //     console.log(toList,'multi')
                //     for (let i = 0; i < toList.length; i++) {
                //       const result = await sendMail(toList[i]);
                //       console.log(`Email sent to ${toList[i]}`);
                //     }
                //   }

                // multimail()

            }


        });
    });
});


// .then(result=>console.log(`email sent successfully ${result}`))
// .catch(console.log)