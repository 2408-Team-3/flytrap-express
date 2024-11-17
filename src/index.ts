import { init } from './config';
import { setUpExpressErrorHandler } from './handler/expressHandler';
import { captureException } from './logger/captureException';
import { FlytrapError } from './utils/FlytrapError';

const flytrap = {
  init,
  setUpExpressErrorHandler,
  captureException,
  FlytrapError,
};

export default flytrap;