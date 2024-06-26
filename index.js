// const express = require('express')
// const bodyParser = require('body-parser')
// const request = require('request')
// const https = require('https')
// const dotenv = require('dotenv')
// dotenv.config()

// const app = express()
// app.use(express.static("public"))

// app.use(bodyParser.urlencoded({ extended: true }))

// //get request
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html')
// })

// //post request
// app.post('/', (req, res) => {

//     const email = req.body.email;
//     const password = req.body.password;

//     const data = {
//         members: [
//             {
//                 email_address: email,
//                 status: "subscribed",
//                 merge_fields: {
//                     // PASSWORD: password
//                     FNAME: password
//                 }
//             }
//         ]
//     }

//     const jsonData = JSON.stringify(data)

//     const url = process.env.MURL
//     const options = {
//         method: "POST",
//         auth: process.env.AUTH
//     }

//     const request = https.request(url, options, (response) => {

//         //response on success and failure
//         if (response.statusCode === 200) {
//             res.sendFile(__dirname + '/success.html')
//         } else {
//             res.sendFile(__dirname + '/failure.html')
//         }

//         response.on("data", (data) => {
//             console.log(JSON.parse(data))
//         })
//     })
//     request.write(jsonData);
//     request.end();


// })

// app.post('/failure', (req, res) => {
//     res.redirect('/')
// })

// const PORT = process.env.PORT || 4000
// //listening on port
// app.listen(PORT, () => {
//     console.log(`app listening on port ${PORT}`)
// })







const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// GET request to serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// POST request to handle form submission
app.post('/', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: password
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = process.env.MURL;
    const options = {
        method: "POST",
        auth: process.env.AUTH
    };

    const request = https.request(url, options, (response) => {
        let responseData = '';
        
        response.on("data", (chunk) => {
            responseData += chunk;
        });

        response.on("end", () => {
            if (response.statusCode === 200) {
                res.sendFile(__dirname + '/success.html');
            } else {
                console.error('Mailchimp API error:', responseData);
                res.sendFile(__dirname + '/failure.html');
            }
        });
    });

    request.on("error", (error) => {
        console.error('Request error:', error);
        res.sendFile(__dirname + '/failure.html');
    });

    request.write(jsonData);
    request.end();
});

// Redirect to the homepage on failure
app.post('/failure', (req, res) => {
    res.redirect('/');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
});
