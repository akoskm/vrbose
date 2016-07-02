import React from 'react';
import request from 'superagent';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Button from 'react-bootstrap/lib/Button';

import Summary from './Summary';
import Triggers from './triggers/Triggers';
import InputComponent from '../InputComponent';

class EditWatcher extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      watcher: {
        name: 'New Watcher'
      }
    };

    this.updateProperty = this.updateProperty.bind(this);
    this.saveWatcher = this.saveWatcher.bind(this);
  }

  componentDidMount() {
    let watcherId = this.props.routeParams.id;
    if (watcherId) {
      let url = '/api/watchers/' + watcherId;
      this.watcherRequest = request.get(url).end((err, response) => {
        let res = response.body;
        if (res.success) {
          this.setState({
            watcher: res.result
          });
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.watcherRequest) {
      this.watcherRequest.abort();
    }
  }

  saveWatcher() {
    const watcher = this.state.watcher;
    let url = '/api/watchers/';
    if (watcher._id) {
      url = url + watcher._id;
      request.put(url).send(watcher).end((err, response) => {
        let res = response.body;
        if (!res.success) {
          alert(response.body);
        }
      });
    } else {
      request.post(url).send(watcher).end((err, response) => {
        let res = response.body;
        if (res.success && res.watcher) {
          this.props.history.pushState(null, '/watchers/' + res.watcher._id);
        }
      });
    }
  }

  updateProperty(key, value) {
    let newState = this.state.watcher;
    newState[key] = value;
    this.setState({
      watcher: newState
    });
  }

  render() {
    let watcher = this.state.watcher;
    let buttonText = 'Create';
    let summary = '';
    let triggers = '';
    if (watcher._id) {
      buttonText = 'Save';
      summary = (<Summary matchers={watcher.matchers} watcherId={watcher._id}/>);
      triggers = (<Triggers triggers={watcher.triggers} watcherId={watcher._id}/>);
    }
    let formElements = [{
      id: 'id',
      name: 'ID'
    }, {
      id: 'name',
      name: 'Name'
    }, {
      id: 'filename',
      name: 'Filename'
    }];
    let form = (formElements.map((fe) => {
      return (
        <InputComponent
          name={fe.id}
          label={fe.name}
          value={watcher[fe.id]}
          onChange={this.updateProperty}
        />
      );
    }));
    return (
      <div>
        <Row>
          <Col xs={12} md={6} lg={6}>
            <h4>{watcher.id}</h4>
            <Form horizontal>
              {form}
              <FormGroup className='pull-right'>
                <Col sm={12}>
                  <Button type='button' onClick={this.saveWatcher}>
                    {buttonText}
                  </Button>
                </Col>
              </FormGroup>
            </Form>
          </Col>
          <Col lg={6} md={6} sm={6}>
            {summary}
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            {triggers}
          </Col>
        </Row>
      </div>
    );
  }
}

EditWatcher.propTypes = {
  routeParams: React.PropTypes.object.isRequired,
  history: React.PropTypes.object.isRequired
};

export default EditWatcher;
