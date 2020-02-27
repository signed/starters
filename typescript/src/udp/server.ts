//https://gist.github.com/sid24rane/6e6698e93360f2694e310dd347a2e2eb

import { RemoteInfo } from 'dgram';

const dgram = require('dgram');

const PORT = 3333;
const HOST = '127.0.0.1';

const server = dgram.createSocket('udp4');

server.on('error', (error: Error) => {
  console.log('Error: ' + error);
  server.close();
});

server.on('listening', () => {
  const address = server.address();
  console.log('UDP Server listening on ' + address.address + ':' + address.port);
});

server.on('message', (message: Buffer, remote: RemoteInfo) => {
  console.log(remote.address + ':' + remote.port + ' - ' + message);


  //sending msg
  server.send(message, remote.port, remote.address, (error: Error | null) => {
    if (error === null) {
      console.log('udp_server', 'info', 'Data sent !!!');
    } else {
      console.log('error sending to client');
    }
  });
});

server.bind(PORT, HOST);