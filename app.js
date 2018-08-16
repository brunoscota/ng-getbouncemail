// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
if (process.env.NodeEnv !== "prod") {
    require("dotenv").load();
}

const sgMail = require('@sendgrid/mail');
const sgClient = require('@sendgrid/client');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
sgClient.setApiKey(process.env.SENDGRID_API_KEY);
const mailto = process.env.MAILTO;
const subject = process.env.SUBJECT;
const mailfrom = process.env.MAILFROM;


MainProgram = async function(){
    try{
        let returned = await GetBounceMail();
        if (returned.length === 0){
            console.log(returned[0]); 
        }else{
            await SendMailAlert(returned, mailto, subject, mailfrom);
            console.log(returned[0]);  
        }        
    }catch(e){
        console.log(e);
    }
}
setInterval(MainProgram, process.env.FETCH_INTERVAL);

GetBounceMail = function() {
    return new Promise((resolve,reject) =>{
        let request = {
            method: 'GET',
            url: '/v3/suppression/bounces/brunossssssa@gmail.com'
        }
        sgClient.request(request)
        .then(([response, body]) => {
            resolve(body);
        })
    })
}

SendMailAlert = function(returned, mailto, subject, mailfrom){
    return new Promise((resolve,reject) =>{
        let msg = {
            to: mailto,
            from: mailfrom,
            subject: subject,
            text: `Hi! THIS IS AN AUTOMATED MESSAGE TO ALERT YOU ABOUT A BOUNCED MAIL - PLEASE DO NOT REPLY DIRECTLY TO THIS EMAIL \n\n\n Email: ${returned[0].email} \n Reason: ${returned[0].reason} \n Code Status: ${returned[0].status}`,
          };
          sgMail.send(msg);
          console.log(msg);
          resolve("sent");
    });
}