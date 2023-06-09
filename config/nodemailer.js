const nodemailer = require("nodemailer");
const { google } = require("googleapis")
const {GOOGLE_USER, GOOGLE_MAIL_KEY, GOOGLE_CLIENTID, GOOGLE_CLIENTSECRET, GOOGLE_REFRESHTOKEN} = process.env

const OAuth2 = google.auth.OAuth2;

//EMAIL QUE SE ENVIARÁ AL USUARIO:
//(email será el del usuario, y code será la uniqueString);
//------------
//MESSAGE:
//Mensage que le llegará al usuario.
//------------
//TRANSPORTER:
//Funcion encargada de enviar la data al email del usuario de parte del servidor con el email del proyecto
const sendVerification = async (email, code, index) => {

    const myOAuth2Client = new OAuth2( //creating the settings with 3 params
        GOOGLE_CLIENTID,
        GOOGLE_CLIENTSECRET,
        "https://developers.google.com/oauthplayground"
    );

    myOAuth2Client.setCredentials({
        refresh_token: GOOGLE_REFRESHTOKEN,
    });

    const accessToken = myOAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
        service: "gmail",
        
        auth: {
            user: "arterest002@gmail.com",
            type: "OAuth2",
            clientId: GOOGLE_CLIENTID,
            clientSecret: GOOGLE_CLIENTSECRET,
            refreshToken: GOOGLE_REFRESHTOKEN,
            accessToken: accessToken,
        },
        tls: {
            rejectUnauthorized: false, //para que el antivirus no bloquee
        },
    });
    
    const message = [
    {
        from: GOOGLE_USER,
        to: email,
        subject: "Verify your account. (Don't reply)",
        html: `<b>Thanks for register.Please confirm your arterest account:</b>
                <a href="https://arterest.vercel.app/verifyEmail/${code}">Click here to verify</a>` 
    },
    {
        from: GOOGLE_USER,
        to: email,
        subject: "Congratulations! You Artist Request Approved",
        html: `<b>felicitaciones! 
        Ya eres artista en nuestro sitio web. ¡Ya puedes vender tus cuadros!. Gracias por su interes en nuestro sistema de ventas.</b>
                <a href="https://arterest.vercel.app/home">Go to web-site!</a>` 
    },
    {
        from: GOOGLE_USER,
        to: email,
        subject: "CHANGE PASSWORD - ARTEREST",
        html: `<b>You can change you password! <b></br>
            <h1>Follow the next link:</h1>
                <a href="https://arterest.vercel.app/password/${code}">CLICK HERE!</a>
                <p>The code expires in 1 day</p>` 
                
    }
    ]
    await transporter.sendMail(message[index], (error, response) => {
        if(error){
            console.log(error);
        } else {
            console.log("check email");
        }
    })
}

module.exports = sendVerification
