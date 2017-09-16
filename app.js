var restify = require('restify');
var builder = require('botbuilder');
const formflowbotbuilder = require('formflowbotbuilder');

var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "350eceee-f504-4e41-a8d7-1b45311eba04",
    appPassword: "0koA58ffFB2EwfoZfLQtDfN"
});
const bot = new builder.UniversalBot(connector);
 
const myDialogName = 'getFields';

// Listen for messages from users 
server.post('/api/messages', connector.listen());

bot.dialog('/', function (session, args) {
    if (!session.userData.greeting) {
        session.send("Hello. Where do you wanna go?");
        session.userData.greeting = true;
    } else if (!session.userData.name) {
        getName(session);
    } 
    else if (!session.userData.email) {
        getEmail(session);
    } 
    else if (!session.userData.password) {
        getPassword(session);
    }
    else {
        session.userData = null;
    }
    session.endDialog();
});

function getName(session) {
    name = session.message.text;
    session.userData.name = name;
    session.send("Nice, " + name + "! Do you want a place near the restaurants?");
}

function getEmail(session) {
    email = session.message.text;
    session.userData.email = email;
    session.send("Nice! What type of activities do you like?");
}

function getPassword(session) {
    password = session.message.text;
    session.userData.password = password;
    session.send("Do you want a low budget stay?");
}

function sendData(data, cb) {
    http.get("http://local.dev/aplostestbot/saveData.php?name=" + data.name + "&email=" + data.email + "&password=" + data.password, function (res) {
        var msg = '';
        res.on("data", function (chunk) {
            msg += chunk;
        });

        res.on('end', function () {
            cb(msg);
        });

    }).on('error', function (e) {
        console.log("Got error: " + e.message);
    });
}

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
// var bot = new builder.UniversalBot(connector, function (session) {
//     session.send("You said: %s", session.message.text);
// });

// formflowbotbuilder.executeFormFlow('./sample.json', bot, myDialogName).then(function (responses) {
//     bot.dialog('/', [function (session) {
//         session.beginDialog(myDialogName);
//     },
//     function (session, results) {
//         //responses from the user are in results variable as well as in the responses callback argument
//         session.send('results: ' + JSON.stringify(results));
//     }]);
// }).catch((error) => console.log(error));


