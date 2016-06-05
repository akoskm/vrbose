import React from 'react';

import request from 'superagent';
import classNames from 'classnames';

import Button from 'react-bootstrap/lib/Button';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';

class Trigger extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      trigger: null
    };

    this.onEdit = this.onEdit.bind(this);
    this.onSave = this.onSave.bind(this);
    this.isValid = this.isValid.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onCreate() {
    let trigger = this.state.trigger;
    if (this.isValid(trigger)) {
      const url = '/api/watchers/' + this.props.watcherId + '/triggers';
      request.post(url).send({
        type: trigger.type,
        recipient: trigger.recipient
      }).end((err, response) => {
        let res = response.body;
        if (res.success) {
          this.props.trigger._id = res.result._id;
          this.setState({
            editing: false
          });
        }
      });
    }
  }

  onEdit() {
    this.setState({
      editing: true
    });
  }

  onCancel() {
    // edited existing
    if (this.state.trigger._id) {
      this.setState({
        editing: false
      });
    } else {
      this.props.onCancel(this.props.index);
    }
  }

  onSave() {
    let trigger = this.state.trigger;
    if (this.isValid(trigger)) {
      const url = '/api/watchers/' + this.props.watcherId + '/triggers/' + trigger._id;
      request.put(url).send({
        type: trigger.type,
        recipient: trigger.recipient
      }).end((err, response) => {
        let res = response.body;
        if (res.success) {
          this.setState({
            editing: false
          });
        }
      });
    }
  }

  handleChange(e) {
    let target = e.target;
    if (!e.target.attributes || !e.target.attributes.getNamedItem('data-prop')) {
      throw 'data-prop isn\'t found on ' + target.outerHTML;
    }
    let key = target.attributes.getNamedItem('data-prop').value;
    let newState = this.props.trigger;
    newState[key] = target.value;
    this.setState({
      trigger: newState
    });
  }

  isValid(trigger) {
    if (!trigger || !trigger.recipient) {
      this.setState({
        validationState: 'error'
      });
      return false;
    }
    return true;
  }

  render() {
    // this.state.trigger = this.props.trigger;
    let editing = this.state.editing;
    let helpBlock = '';
    let trigger = this.props.trigger;
    let cancelButton = '';
    let inputClass = classNames({
      'input-sm': true,
      'input-editable': true,
      'input-editing': editing
    });
    let primaryTitle = 'Edit';
    let primaryIcon = 'pencil';
    let primaryFunction = this.onEdit;
    if (!trigger._id) {
      editing = true;
    }
    if (editing) {
      primaryIcon = 'ok';
      // if trigger has _id it already exists
      if (trigger._id) {
        primaryTitle = 'Save';
        primaryFunction = this.onSave;
      } else {
        primaryTitle = 'Add';
        primaryFunction = this.onCreate;
      }
      cancelButton = (<Button
        type='button'
        className='btn-xs'
        onClick={this.onCancel}
        title='Edit'
      >
        <Glyphicon glyph='remove'/> Cancel
      </Button>);
    }
    if (this.state.validationState) {
      helpBlock = (<HelpBlock>Recipient is required.</HelpBlock>);
    }
    return (
      <tr>
        <td>
          <FormControl
            type='text'
            data-prop='name'
            value={trigger.type}
            className={inputClass}
            onChange={this.handleChange}
            disabled
          />
        </td>
        <td>
          <FormGroup validationState={this.state.validationState}>
            <FormControl
              type='text'
              data-prop='recipient'
              value={trigger.recipient}
              className={inputClass}
              onChange={this.handleChange}
              disabled={!editing}
            />
            {helpBlock}
          </FormGroup>
        </td>
        <td>{trigger.count}</td>
        <td>{trigger.lastTriggered}</td>
        <td>
          <Button
            type='button'
            bsStyle='primary'
            className='btn-xs'
            onClick={primaryFunction}
            title={primaryTitle}
          >
            <Glyphicon glyph={primaryIcon}/> {primaryTitle}
          </Button>
          {' '}
          {cancelButton}
        </td>
      </tr>
    );
  }
}

Trigger.propTypes = {
  watcherId: React.PropTypes.object.isRequired,
  trigger: React.PropTypes.object.isRequired,
  editing: React.PropTypes.object.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  index: React.PropTypes.object.isRequired
};

export default Trigger;
