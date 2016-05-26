import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Col from 'react-bootstrap/lib/Col';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

class WatcherComponent extends React.Component {

  constructor(props) {
    super(props);

    this.createWatcher = this.createWatcher.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  createWatcher() {
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
    this.setState(newState);
  }

  render() {
    return (
      <div>
        <h4>New Watcher</h4>
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
              />
            </Col>
          </FormGroup>

          <FormGroup>
            <Col smOffset={2} sm={10}>
              <Button type='button' onClick={this.createWatcher}>
                Create
              </Button>
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

export default WatcherComponent;
