import React from 'react';
import { dispatch } from '../stores/user/UserDispatcher';
import UserStore from '../stores/user/UserStore';
import { Link } from 'react-router';

import $ from 'jquery';

import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import Button from 'react-bootstrap/lib/Button';
import NavItem from 'react-bootstrap/lib/NavItem';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';

class HeaderComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      labelText: 'Sign In',
      username: ''
    };

    this.goToSignIn = this.goToSignIn.bind(this);
    this.goToSignUp = this.goToSignUp.bind(this);
    this.goToProfile = this.goToProfile.bind(this);
    this.goToLanding = this.goToLanding.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  goToSignIn(e) {
    this.props.history.pushState(null, '/signin');
  }

  goToSignUp(e) {
    this.props.history.pushState(null, '/signup');
  }

  goToProfile(e) {
    this.props.history.pushState(null, '/profile');
  }

  goToLanding(e) {
    this.props.history.pushState(null, '/');
  }

  signOut(e) {
    let self = this;
    $.post('/api/logout', this.state).done(function (data) {
      if (data.success) {
        dispatch({
          type: 'user/logout'
        });
        self.setState({
          username: ''
        });
        self.props.history.pushState(null, '/');
      }
    });
  }

  render() {
    const { username } = this.props;
    let userMenu;
    let signUpButton;
    if (username) {
      userMenu = (
        <NavDropdown eventKey={3} title={username} id='basic-nav-dropdown'>
          <MenuItem eventKey={3.1} onClick={this.goToProfile}>Profile</MenuItem>
          <MenuItem eventKey={3.2}>Help</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey={3.3} onClick={this.signOut}>Sign Out</MenuItem>
        </NavDropdown>
      );
    } else {
      signUpButton = (
        <Nav pullRight>
          <NavItem onClick={this.goToSignUp}>Sign Up</NavItem>
          <NavItem primary onClick={this.goToSignIn}>Sign In</NavItem>
        </Nav>
      );
    }
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a onClick={this.goToLanding}>vrbose</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav pullRight>
          {userMenu}
        </Nav>
        {signUpButton}
      </Navbar>
    );
  }
}

HeaderComponent.propTypes = {
  history: React.PropTypes.object.isRequired,
  username: React.PropTypes.string.isRequired
};

export default HeaderComponent;
