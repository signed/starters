import { RemoteInfo } from 'dgram';

export {};
const dgram = require('dgram');

const PORT = 3333;
const HOST = '127.0.0.1';
const client = dgram.createSocket('udp4');

const message = Buffer.from('My KungFu is Good!');

client.on('message', (msg: Buffer, info: RemoteInfo) => {
  console.log('Data received from server: ' + msg.toString());
  console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
});

client.on('error', ((err: Error) => console.log(err)));

client.send(message, 0, message.length, PORT, HOST, (err: Error | null) => {
  if (err) throw err;
  console.log('UDP message sent to ' + HOST + ':' + PORT);
});
