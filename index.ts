/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-await-in-loop */
import { App, BlockButtonAction, SayFn } from '@slack/bolt';
import { Context, RuntimeClientFactory, TraceType } from '@voiceflow/runtime-client-js';

import kvstore from './store';
import { stripEmojis } from './utils';
import { stripBackSlashs } from './utils';
import { cleanText } from './utils';

require('dotenv').config();
// create a bot
const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

const factory = new RuntimeClientFactory({
  versionID: process.env.VOICEFLOW_VERSION_ID!,
  apiKey: process.env.VOICEFLOW_API_KEY!,
  endpoint: process.env.VOICEFLOW_RUNTIME_ENDPOINT,
  dataConfig: {
    tts: false,
    stripSSML: false,
  },
});

const response = async (context: Context, userID: string, say: SayFn) => {
  await kvstore.set(userID, context.toJSON().state);
  console.log(context.getTrace());
  // eslint-disable-next-line no-restricted-syntax
  for (const trace of context.getTrace()) {
    if (trace.type === TraceType.SPEAK) {
      if (trace.payload.message.includes('"blocks":')) {
        await say(JSON.parse(cleanText(trace.payload.message)) as any);
      } else {
        await say({ blocks: [{ type: 'section', text: { type: 'mrkdwn', text: stripBackSlashs(trace.payload.message) } }] } as any);
      }
    }
    if (trace.type === TraceType.VISUAL && trace.payload.visualType === 'image') {
      const url = context.variables.get('logo');
      if (url != 0) {
        await say({ blocks: [{ type: 'image', image_url: url, alt_text: 'image' }] } as any);
      } else {
        await say({ blocks: [{ type: 'image', image_url: trace.payload.image, alt_text: 'image' }] } as any);
      }
    }
  }

  const chips = context.getChips();
  if (chips.length) {
    // response chips

    await say({
      blocks: [
        {
          type: 'actions',
          elements: chips.map(({ name }) => ({
            type: 'button',
            action_id: `chip:${Math.random().toString(32)}:${userID}`,
            text: {
              type: 'plain_text',
              text: name,
              emoji: true,
            },
            value: name,
          })),
        },
      ],
    } as any);
  }
};

const getClient = async (userID: string) => {
  const state = await kvstore.get(userID);
  return factory.createClient(state);
};

const ANY_WORD_REGEX = new RegExp(/(.+)/i);
app.message(ANY_WORD_REGEX, async ({ message, say }) => {
  if (message.subtype === 'message_changed' || message.subtype === 'message_deleted' || message.subtype === 'message_replied') return;
  const utterance = stripEmojis(message.text);

  const client = await getClient(message.user);
  const context = await client.sendText(utterance);
  await response(context, message.user, say);
});

const CHIP_ACTION_REGEX = new RegExp(/chip:(.+):(.+)/i);
app.action<BlockButtonAction>(CHIP_ACTION_REGEX, async ({ action, say, ack, payload }) => {
  ack();
  if (action.type !== 'button') return;

  // get the user id from the action id
  const userID = action.action_id.split(':').slice(2).join(':');
  const utterance = stripEmojis(action.text.text);

  const client = await getClient(userID);
  const context = await client.sendText(utterance);
  await response(context, userID, say);
});

(async () => {
  // Start the app
  let port = (process.env.PORT as any) || 3000;
  await app.start(port);
  console.log(`⚡️ Bolt app is running on port ${port}!`);
})();
