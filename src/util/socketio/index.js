import SocketIO from 'socket.io';

let _server;

class SocketIOFactory {

  constructor(server) {
    _server = server;
  }

  initialize(server) {
    if (!server) {
      throw 'Server is empty';
    }
    _server = new SocketIO(server);
  }

  getInstance() {
    return _server;
  }
}

export default new SocketIOFactory();
