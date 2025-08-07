// jazzcash/generateHash.js
const crypto = require('crypto');
require('dotenv').config();

function generateHash(data) {
  const integritySalt = process.env.INTEGRITY_SALT;

  const sorted = Object.keys(data)
    .sort()
    .map((key) => `${data[key]}`)
    .join('|');

  const stringToHash = integritySalt + '|' + sorted;

  const hash = crypto
    .createHash('sha256')
    .update(stringToHash, 'utf8')
    .digest('hex');

  return hash;
}

module.exports = generateHash;
