import type { Action } from './UserActions';

import { Dispatcher } from 'flux';

const instance: Dispatcher<Action> = new Dispatcher();
export default instance;

// So we can conveniently do, `import {dispatch} from './UserDispatcher';`
export const dispatch = instance.dispatch.bind(instance);
