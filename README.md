![image](/images/slack-bot.jpeg)

# slack-voiceflow-bot

## Create own Bot for Slack

First, you should create your own app in Slack (https://api.slack.com/apps
).<br>You can follow the following guide: https://slack.dev/bolt-js/tutorial/getting-started.

## Setting up the Project

Install and run the project:

1. Clone this repo:
```
git clone https://github.com/voiceflow-gallagan/voiceflow-crypto-slackbot.git && cd voiceflow-crypto-slackbot
```

2. Install dependencies:
```
yarn install
```

3. Create your .env file
```
SLACK_BOT_TOKEN='token for your Slack app'
SLACK_SIGNING_SECRET='signing secret for your Slack app'
PORT=3000
VOICEFLOW_VERSION_ID='project version id'
VOICEFLOW_API_KEY='workspace API key'
VOICEFLOW_RUNTIME_ENDPOINT='https://general-runtime.voiceflow.com'
```

4. Launch project:
```
yarn start
```

## Write bot’s code

You can initiate your bot like this:
```js
const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

const factory = new RuntimeClientFactory({
  versionID: process.env.VOICEFLOW_VERSION_ID!,
  apiKey: process.env.VOICEFLOW_API_KEY!,
  endpoint: process.env.VOICEFLOW_RUNTIME_ENDPOINT,
});
```

## How to contribute?

1. Fork this repo
2. Clone your fork
3. Code 🤓
4. Test your changes
5. Submit a PR!
