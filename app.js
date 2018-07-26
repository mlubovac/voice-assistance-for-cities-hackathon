const builder = require('botbuilder');
const express = require('express');
const pointInPolygon = require('point-in-polygon');
const getLocation = require('./utils/location');
const data = require('./utils/data');

const server = express();

//=========================================================
// Bot Setup
//=========================================================
const connector = new builder.ChatConnector({
    appId: process.env.MY_APP_ID,
    appPassword: process.env.MY_APP_PASSWORD
});

//=========================================================
// LUIS set up
//=========================================================
const luisRecognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL)

//=========================================================
// Bots Dialogs
//=========================================================
const bot = new builder.UniversalBot(connector);

const intents = new builder.IntentDialog({
    recognizers: [luisRecognizer]
});

intents.onDefault([
    (session) => {
        session.beginDialog('/welcome')
    }
])

intents.matches('BulkTrashPickupDates', [
    (session) => {
        session.beginDialog('/BulkTrashPickupDates');
    }
])

bot.dialog('/', intents)

bot.dialog('/welcome', [
    (session) => {
        session.send("Hi I can help you with bulk trash pickup schedule.");
        session.endDialog();
    }
])

bot.dialog('/BulkTrashPickupDates', [
    (session) => {
        builder.Prompts.text(session, 'What is your address');
    },
    async (session, results) => {
        const location = await getLocation(results.response)
        const pickupArea = data.filter((area) => pointInPolygon([location.latitude, location.longitude], area.boundary))[0]

        if (pickupArea) {
            session.send(`Bulk trash pickup dates for **${results.response}** are <br /> ${pickupArea.pickupDates.join('<br />')}`);
        } else {
            session.send(`Couldn't find pickup date for **${results.response}**`);
        }

        session.endDialog();
    }
])

//=========================================================
// Server Setup
//=========================================================
server.post('/api/messages', connector.listen());

server.listen(process.env.port || process.env.PORT || 3978, () => {
   console.log('server listening');
});