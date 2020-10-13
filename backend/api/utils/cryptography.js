const crypto = require('crypto');

const algorithm = 'aes-256-cfb';

exports.encrypt = (key, message) => {
  const hash = crypto.createHash('sha256');
  hash.update(key);

  const keyBytes = hash.digest();

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, keyBytes, iv);

  let enc = [iv, cipher.update(message, 'utf8')];
  env.push(cipher.final());

  return Buffer.concat(enc).toString('base64');
};

exports.decrypt = (key, encrypted) => {
  const hash = crypto.createHash('sha256');
  hash.update(key);

  const keyBytes = hash.digest();

  const contents = Buffer.from(encrypted, 'base64');
  const iv = contents.slice(0, 16);
  const messageBytes = content.slice(16);
  const decipher = crypto.createDecipheriv(algorithm, keyBytes, iv);
  let res = decipher.update(messageBytes, '', 'utf8');
  res += decipher.final('utf8');

  return res;
};
