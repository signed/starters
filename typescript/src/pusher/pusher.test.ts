// https://github.com/signed/pusher-js-mock
import { PusherMock } from 'pusher-js-mock';
import { subscribe } from 'pusher/pusher';

jest.mock("pusher-js", () => require('pusher-js-mock').PusherMock);

describe('stuff', () => {
  it('should ', () => {

    const onMessage = jest.fn();
    subscribe(onMessage);

    const pusher = new PusherMock();
    const channel = pusher.subscribe('the-channel');
    channel.emit('the-message');

    expect(onMessage).toHaveBeenCalled()
    //expect(pusher.clientKey).toEqual('the-secret-api-key');
  });
});