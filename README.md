# Alexa Fitbit Checker Skill

A simple Alexa skill to query heartrate and sleep logged by Fitbit.

Say, "Alexa, ask my fitbit checker how I slept" or "Alexa, ask my fitbit checker how my heart is".

## Deployment

There are three steps to the deployment. Create the Lambda function that acts as the backend for the skill. Create the skill itself. Create a Fitbit application and link it to the skill. This last step is what allows your Alex skill to get hold of the Fitbit data.

The three steps are inter-linked because the different components have to communicate with each other, in both directions, via HTTP requests to URLs that are created at different stages in the process. Fitbit uses OAuth2 to control access to the data it holds about you and which is made available via the Fitbit API. Note that Alexa implements the OAuth2 protocol for you, using Account Linking - so you don't need to write the OAuth code yourself.

## Step 1 - Create the Lambda backend

The Lambda function is written in Node.js.

In your Node.js development environment, create a new folder for the skill and clone this repo into it. Then pull in the packages you need and Zip it all together, ready for uploading to Lambda. For example:

    mkdir alexa-fitbit-checker
    cd alexa-fitbit-checker
    git clone https://github.com/andypowe11/Alexa-Fitbit-Checker-Skill
    cd Alexa-Fitbit-Checker-Skill
    npm install
    zip -r ../alexa.zip *
    cd ..

Using the AWS console, create a new Lambda function, using `Author from Scratch`, `Node.js 8.10` and the `lambda_basic_execution` role.

Under `Code entry type` select `Upload a .zip file` and upload the Zip file above. Note that your code will not be visible (or editable) in the AWS console.

Note the ARN of the function, top right.

## Step 2 - Create the Alexa skill

In a second browser tab, go to the Alex Developer Console and create a new `English (UK)` `Custom` skill. Select `Start from Scratch` and then upload the `invocation.json` file to the Invocation area. Click `Build Model`.

Go to the `Endpoint` tab and choose `AWS Lambda ARN` under `Service Endpoint Type`. Enter the ARN above.

## Step 3 - Create the Fitbit application

In a third browser tab, go to the Fitbit developer console at https://dev.fitbit.com/apps and `Register a new app`.

Fill in the form fields. For the `OAuth 2.0 Application Type` choose `Personal`.

For the `Default Access Type` choose `Read-only`.

Leave the `Callback URL` blank for now.

Click `Save` and then go to `Manage my Apps` and click on your new app name. Note the `OAuth 2.0 Client ID` and various other bits of information.

## Step 4 - Link the Fitbit application and the Alexa skill

Go back to your Alexa skill browser tab and go to `Account Linking`.

The `Do you allow users to create an account or link to an existing account with you?` setting should be on and the `Allow users to enable skill without account linking` setting should be off.

Select `Auth Code Grant` and the grant type.

The `Authorization URI` is `https://www.fitbit.com/oauth2/authorize`.

The `Access Token URI` is `https://api.fitbit.com/oauth2/token`.

The `Client ID` is the `OAuth 2.0 Client ID` taken from the Fitbit application summary page (above).

The `Client Secret` is the `Client Secret` from the Fitbit application summary page (above).

Set the `Client Authentication Scheme` to `HTTP Basic (Recommended)`.

Add `heartrate`, `profile` and `sleep` to the `Scope`.

Note the `Redirect URL` with `layla` in it.

Finally, go back to Fitbit application tbrowser tab and click `Edit Application Settings`. Set the `Callback URL` to the `layla` URL (above).

## Step 5 - Test it

Go back to your Alexa skill browser tab and click on the `Test` button. Type `alexa open my fitbit checker` and see what happens. You should, hopefully, be prompted to link Alexa to your Fitbit account using the Alexa app.

Once that is doen, you should be able to say 'Alexa ask my fitbit checker how I slept'.
