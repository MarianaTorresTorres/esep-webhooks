// Code based on AWS tutorial: https://www.youtube.com/watch?v=i_m5X2DtdPQ
const AWS = require('aws-sdk');
const https = require('https');

exports.handler = async (event, context, callback) => {
    var response = function(success,message){
        if (success){
            return {
                success: success, 
                body: message
            }
        }else{
            return message
        }
    };
    const json = JSON.parse(event.body);
    const payload = JSON.stringify({
        text: `Issue Created: ${json.issue.html_url}`
    });
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const req = https.request(process.env.SLACK_URL, options, (res) => {
        let responseBody = '';
        res.on('data', (body) => {
            if (res.statusCode==200)
                callback(null, response(true,"Slack message was sent successfully!"));
            else
                callback(response(false,"Error sending slack message: "+body)); 
        });
    });
    req.on('error', (error) => {
        console.error(error.message);
        callback(response(false,error.message));
    });
    req.write(payload);
    req.end();
};
