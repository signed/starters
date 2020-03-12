import Pusher from 'pusher-js';

export const subscribe = (onMessage: () => void) => {
  const pusher = new Pusher('this-is-the-api-key');
  const channel = pusher.subscribe('the-channel');
  channel.bind('the-message', onMessage)
  //pusher.disconnect();
};