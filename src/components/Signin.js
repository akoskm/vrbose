import React from 'react';
import $ from 'jquery';
import { Navigation } from 'react-router';
import { dispatch } from '../stores/user/UserDispatcher';

import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

class SignInComponent extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      email: '',
      passw: ''
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange(e) {
    this.setState({
      email: e.target.value
    });
  }

  handlePassChange(e) {
    this.setState({
      passw: e.target.value
    });
  }

  handleSubmit(e) {
    let self = this;
    e.preventDefault();
    if (!this.state.email) {
      this.state.emailError = 'Username is required';
      if (!this.state.passw) {
        this.state.passwError = 'Password is required';
      }
    } else {
      $.post('/api/login', this.state).done(function (data) {
        if (data.success) {
          let user = data.user;
          self.setState({
            username: user.username,
            status: user.status
          });
          dispatch({
            type: 'user/login',
            user
          });
          self.props.history.pushState(null, '/profile');
        }
      });
    }
  }

  render() {
    return (
      <Row>
        <Col md={3}>
          <form className='registrationForm' onSubmit={this.handleSubmit}>
            <Input
              id='email'
              placeholder='Username'
              type='text'
              value={this.state.email}
              onChange={this.handleEmailChange}
              errorText={this.state.emailError}
            />
            <Input
              id='passw'
              placeholder='Password'
              type='password'
              value={this.state.passw}
              onChange={this.handlePassChange}
              errorText={this.state.passwError}
            />
            <Button type='submit' secondary>Log in</Button>
          </form>
        </Col>
      </Row>
    );
  }
}

SignInComponent.propTypes = {
  history: React.PropTypes.object.isRequired
};

export default SignInComponent;
