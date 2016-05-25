import log4js from 'log4js';
import path from 'path';

let instance;

const logger = {

  initLogger(config) {
    log4js.configure(path.join(config.workingDir, './src/config/log4js.json'));
    instance = log4js.getLogger();
    return instance;
  },

  get instance() {
    return instance;
  }
};

export { logger };
export default instance;
