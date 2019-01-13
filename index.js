/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const axios = require('axios');
const datetime = require('node-datetime');

const WelcomeHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'WelcomeIntent');
  },
  async handle(handlerInput) {
    // Get the access token
    var accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;

    if (accessToken == undefined) {
        // The request did not include a token, so tell the user to link
        // accounts and return a LinkAccount card
        var speechText = "You must have a Fitbit account to check your heart. " +
                         "Please use the Alexa app to link your Amazon account " +
                         "with your Fitbit Account.";

        return handlerInput.responseBuilder
            .speak(speechText)
            .withLinkAccountCard()
            .getResponse();
    } else {
      var speechText = "";
      var cardText = "";
      var firstName = "";
      const fitbitProfileUrl = 'https://api.fitbit.com/1/user/-/profile.json';
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      try {
        const response = await axios.get(fitbitProfileUrl);
        //console.log(JSON.stringify(response.data));
        firstName = response.data.user.firstName;
        speechText = "Hi, " + firstName + ". Say how is my heart or how did I sleep.";
        cardText = "Hi " + firstName;
      } catch (error) {
        console.error(error);
        speechText = "Sorry, I'm having trouble getting data from Fitbit right now. Please try later";
        cardText = "Sorry, I'm having trouble getting data from Fitbit right now. Please try later";
      }
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard(SKILL_NAME, cardText)
        .getResponse();
    }
  }
};

const CheckMyHeartHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
        && request.intent.name === 'CheckMyHeartIntent';
  },
  async handle(handlerInput) {
    // Get the access token
    var accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;

    if (accessToken == undefined) {
        // The request did not include a token, so tell the user to link
        // accounts and return a LinkAccount card
        var speechText = "You must have a Fitbit account to check your heart. " +
                         "Please use the Alexa app to link your Amazon account " +
                         "with your Fitbit Account.";

        return handlerInput.responseBuilder
            .speak(speechText)
            .withLinkAccountCard()
            .getResponse();
    } else {
      var speechText = "";
      var cardText = "";
      var fatburn = 0;
      var cardio = 0;
      const fitbitHeartUrl = 'https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json';
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      try {
        const response = await axios.get(fitbitHeartUrl);
        //console.log(JSON.stringify(response.data["activities-heart"][0].value));
        speechText = "Your resting heart rate today is " + response.data["activities-heart"][0].value.restingHeartRate.toString() + " b p m. ";
        cardText = "Resting heart rate: " + response.data["activities-heart"][0].value.restingHeartRate.toString() + " bpm\n";
        for(var zone in response.data["activities-heart"][0].value.heartRateZones) {
          if (response.data["activities-heart"][0].value.heartRateZones[zone].name == "Fat Burn") {
            fatburn = response.data["activities-heart"][0].value.heartRateZones[zone].minutes;
          }
          if (response.data["activities-heart"][0].value.heartRateZones[zone].name == "Cardio") {
            cardio = response.data["activities-heart"][0].value.heartRateZones[zone].minutes;
          }
        }
        if (fatburn || cardio) {
          speechText += "So far today you have spent ";
          if (fatburn) {
            speechText += fatburn.toString() + " minutes in the fat burn zone.";
            cardText += "Fat burn zone: " + fatburn.toString() + " minutes\n";
          }
          if (fatburn && cardio) {
            speechText += " and ";
          } else {
            speechText += ".";
          }
          if (cardio) {
            speechText += cardio.toString() + " minutes in cardio.";
            cardText += "Cardio zone: " + cardio.toString() + " minutes";
          }
        }
      } catch (error) {
        console.error(error);
        speechText = "Sorry, I'm having trouble getting data from Fitbit right now. Please try later";
        cardText = "Sorry, I'm having trouble getting data from Fitbit right now. Please try later";
      }
      return handlerInput.responseBuilder
        .speak(speechText)
        .withSimpleCard(SKILL_NAME, cardText)
        .getResponse();
    }
  }
};

const CheckMySleepHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
        && request.intent.name === 'CheckMySleepIntent';
  },
  async handle(handlerInput) {
    // Get the access token
    var accessToken = handlerInput.requestEnvelope.context.System.user.accessToken;

    if (accessToken == undefined) {
        // The request did not include a token, so tell the user to link
        // accounts and return a LinkAccount card
        var speechText = "You must have a Fitbit account to check your heart. " +
                         "Please use the Alexa app to link your Amazon account " +
                         "with your Fitbit Account.";

        return handlerInput.responseBuilder
            .speak(speechText)
            .withLinkAccountCard()
            .getResponse();
    } else {
      var speechText = "";
      var cardText = "";
      var minutesAsleep = 0;
      var timeInBed = 0;
      var minutesAwake = 0;
      var dt = datetime.create();
      var formattedDate = dt.format('Y-m-d');
      //console.log(formattedDate);
      const fitbitSleepUrl = `https://api.fitbit.com/1.2/user/-/sleep/date/${formattedDate}.json`;
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      try {
        const response = await axios.get(fitbitSleepUrl);
        //console.log(JSON.stringify(response.data));
        minutesAsleep = response.data.summary.totalMinutesAsleep;
        timeInBed = response.data.summary.totalTimeInBed;
        minutesAwake = timeInBed - minutesAsleep;
        awakeHrs = Math.floor(minutesAwake / 60);
        awakeMins = minutesAwake % 60;
        asleepHrs = Math.floor(minutesAsleep / 60);
        asleepMins = minutesAsleep % 60;
        speechText = `You slept for ${asleepHrs.toString()} hours and ${asleepMins.toString()} minutes. `;
        speechText += `You were awake for ${awakeHrs.toString()} hours and ${awakeMins.toString()} minutes.`;
        cardText = `Time asleep: ${minutesAsleep.toString()} minutes\nTime awake: ${minutesAwake.toString()} minutes`;
      } catch (error) {
        console.error(error);
        speechText = "Sorry, I'm having trouble getting data from Fitbit right now. Please try later";
        cardText = "Sorry, I'm having trouble getting data from Fitbit right now. Please try later";
      }
      return handlerInput.responseBuilder
        .speak(speechText)
        .withSimpleCard(SKILL_NAME, cardText)
        .getResponse();
    }
  }
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const SKILL_NAME = 'My Fitbit checker';
const HELP_MESSAGE = 'You can say how is my heart, or, you can say how did I sleep, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    WelcomeHandler,
    CheckMyHeartHandler,
    CheckMySleepHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
