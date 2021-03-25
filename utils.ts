const emojiRegex = /:[^:\s]*(?:::[^:\s]*)*:/g;
// eslint-disable-next-line import/prefer-default-export
export const stripEmojis = (text: string) => text.replace(emojiRegex, '').trim();

const backslashRegex = /\\n|\\r/g;
// eslint-disable-next-line import/prefer-default-export
export const stripBackSlashs = (text: string) => text.replace(backslashRegex, '\n');

const cleanRegex = /\t/g;
// eslint-disable-next-line import/prefer-default-export
export const cleanText = (text: string) => text.replace(cleanRegex, '').trim();
