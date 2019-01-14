# Alexa Fitbit Checker Skill

A simple Alexa skill to query heartrate and sleep logged by Fitbit.

Say, "Alexa, ask my fitbit checker how I slept" or "Alexa, ask my fitbit checker how my heart is".

## Deployment

There's three parts to the deployment. Create the Lambda function that acts as the backend for the skill. Create the skill itself. Create a Fitbit application and link it to the skill. Fitbit uses OAuth 2 to control access to the data it holds about you and which is made availabkle via the Fitbit API. This last step is what allows your Alex skill to get hold of that data.

## Create the Lambda backend

The Lambda function is written in Node.js. In your node development environment create a new folder for the skill and clone this repo into it.

    npm install
    zip -r ../alexa.zip *

Using the AWS console, create a new Lambda function, using 'Author from Scratch', Node.js 8.10 and the lambda_basic_execution role.

In a second browser tab, go to the Alex Developer Console and create a new English (UK) Custom skill. Select Start from Scratch and then upload the invocation.json file to the Invocation area. Click Build Model.
