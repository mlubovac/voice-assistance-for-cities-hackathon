# voice-assistance-for-cities-hackathon
Voice Assistance for Cities Hackathon

My submission for https://www.azidp.com/voice-activated-assistant-hackathon/

# Summary
This application uses LUIS (https://www.luis.ai) to recognize user's intent. You'll need to set up, train and publish LUIS model to recognize "bulk trash pickup" as "BulkTrashPickupDates" intent.

Once intent is recognized user is prompted to enter an address. Address is sent to geo coding service to obtain geopoint (latitude, longitude) for given street address. Geopoint is then checked against set of geo boundaries to determine pickup area and to return set of pickup dates.