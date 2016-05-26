import React from 'react';
import UserStore from '../stores/user/UserStore';

import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

export default class IndexComponent extends React.Component {

  constructor(props) {
    super(props);

    let currentState = {
      user: UserStore.getLoggedInUser(),
      isLoggedIn: UserStore.isLoggedIn()
    };

    this.state = {
      open: false,
      labelText: 'Sign In',
      username: '',
      user: currentState.user
    };
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs={12} md={6} lg={6}>
            <div>
              Welcome, <span>{this.state.user.username}</span>.
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
