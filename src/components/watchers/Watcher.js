import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Col from 'react-bootstrap/lib/Col';
import Table from 'react-bootstrap/lib/Table';
import Row from 'react-bootstrap/lib/Row';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import request from 'superagent';
import io from 'socket.io-client';

class WatcherComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      watcher: {
        name: 'New Watcher'
      }
    };

    this.saveWatcher = this.saveWatcher.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    let watcherId = this.props.routeParams.id;
    this.watcherRequest = request.get('/api/watchers/' + watcherId).end(function (err, response) {
      let res = response.body;
      if (res.success) {
        this.setState({
          watcher: res.result
        });
      }
    }.bind(this));

    this.socket = io('/ws/watchers/' + watcherId);
    this.socket.on('connect', function () {
      console.log('connected');
    });
    this.socket.on('message', (message) => {
      if (message && this.state.watcher.matchers) {
        let wsMatchers = message.matchers;
        let newMatcherState = this.state.watcher.matchers.map(function (curr) {
          let original = curr;
          let fromWs = wsMatchers.find(function (m) {
            return m.name === curr.name;
          });
          if (fromWs) {
            original.count = original.count + fromWs.count;
          }
          return original;
        });
        this.setState({
          matchers: newMatcherState
        });
      }
    });
  }

  componentWillUnmount() {
    this.watcherRequest.abort();
    this.socket.disconnect();
  }

  saveWatcher() {
    console.log(this.state);
  }

  handleChange(e) {
    let target = e.target;
    if (!e.target.attributes || !e.target.attributes.getNamedItem('data-prop')) {
      throw 'data-prop isn\'t found on ' + target.outerHTML;
    }
    let key = target.attributes.getNamedItem('data-prop').value;
    let newState = {};
    newState[key] = target.value;
    this.setState({
      watcher: newState
    });
  }

  render() {
    let watcher = this.state.watcher;
    let buttonText = 'Create';
    let matchersTable = (<Col xs={12} md={6} lg={6}/>);
    if (watcher._id) {
      buttonText = 'Save';
    }
    if (watcher.matchers && watcher.matchers.length > 0) {
      matchersTable = (<Col xs={12} md={6} lg={6}>
        <h4>Watchers</h4>
        <Table responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Regex</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
          {watcher.matchers.map(function (m) {
            return (
              <tr>
                <td>{m.name}</td>
                <td>{m.regex}</td>
                <td>{m.count}</td>
              </tr>
            );
          })}
          </tbody>
        </Table>
      </Col>);
    }
    return (
      <Row>
        <Col xs={12} md={6} lg={6}>
          <h4>{watcher.name}</h4>
          <Form horizontal>
            <FormGroup controlId='id'>
              <Col componentClass={ControlLabel} sm={2}>
                ID
              </Col>
              <Col sm={10}>
                <FormControl
                  type='text'
                  placeholder='AWSM-WTCHR-1'
                  onChange={this.handleChange}
                  data-prop='id'
                  value={watcher.id}
                />
                <HelpBlock>Must be Unique</HelpBlock>
              </Col>
            </FormGroup>

            <FormGroup controlId='name'>
              <Col componentClass={ControlLabel} sm={2}>
                Name
              </Col>
              <Col sm={10}>
                <FormControl
                  type='text'
                  placeholder='Awesome watcher'
                  onChange={this.handleChange}
                  data-prop='name'
                  value={watcher.name}
                />
                <HelpBlock>Be more descriptive here</HelpBlock>
              </Col>
            </FormGroup>

            <FormGroup controlId='filename'>
              <Col componentClass={ControlLabel} sm={2}>
                Filename
              </Col>
              <Col sm={10}>
                <FormControl
                  type='text'
                  placeholder='/var/log/vrbose.log'
                  onChange={this.handleChange}
                  data-prop='filename'
                  value={watcher.filename}
                />
                <HelpBlock>File to watch</HelpBlock>
              </Col>
            </FormGroup>

            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>
                Watchers
              </Col>
              <Col sm={10}>
                <FormControl
                  componentClass='textarea'
                  onChange={this.handleChange}
                  data-prop='watchers'
                  value={watcher.watchers}
                />
              </Col>
            </FormGroup>

            <FormGroup>
              <Col smOffset={2} sm={10}>
                <Button type='button' onClick={this.saveWatcher}>
                  {buttonText}
                </Button>
              </Col>
            </FormGroup>
          </Form>
        </Col>
        {matchersTable}
      </Row>
    );
  }
}

WatcherComponent.propTypes = {
  params: React.PropTypes.object.isRequired,
  routeParams: React.PropTypes.object.isRequired
};

export default WatcherComponent;
