import Immutable from 'immutable';

const UserRecord = Immutable.Record({
  id: undefined,
  email: undefined
});

export default class User extends UserRecord {

  constructor(id:string, email: string) {
    super({
      id,
      email
    });
  }
}
