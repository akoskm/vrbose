/*
 * @flow
 */

import type { Action } from './UserActions';

import $ from 'jquery';

import Immutable from 'immutable';
import { MapStore } from 'flux/utils';
import User from './User';
import UserDispatcher from './UserDispatcher';

// Set up the store, If we didn't care about order we could just use MapStore
type State = User;

class UserStore extends MapStore<string, User> {

  getInitialState(): State {
    return {};
  }

  reduce(state: State, action: Action): State {
    switch (action.type) {
    case 'user/login':
      this._user = action.user;
      return state;
    case 'user/logout':
      delete this._user;
      return state;
    default:
      return state;
    }
  }

  getLoggedInUser(): User {
    if (this._user) {
      return this._user;
    }
    return {};
  }

  isLoggedIn(): boolean {
    return !!this._user;
  }
}

// Export a singleton instance of the store, could do this some other way if
// you want to avoid singletons.
const instance = new UserStore(UserDispatcher);
export default instance;
