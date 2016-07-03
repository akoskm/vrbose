import React from 'react';
import request from 'superagent';
import classNames from 'classnames';

import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Form from 'react-bootstrap/lib/Form';
import Table from 'react-bootstrap/lib/Table';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import FormGroup from 'react-bootstrap/lib/FormGroup';

import Trigger from './Trigger';

class Triggers extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      triggers: []
    };

    this.onNew = this.onNew.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      triggers: nextProps.triggers
    });
  }

  onNew() {
    this.props.addTrigger({
      type: 'Email',
      recipient: '',
      count: 0,
      lastTriggered: null
    });
  }

  onEdit() {
    this.setState({
      editing: true
    });
  }

  onDelete(i) {
    this.props.removeTrigger(i);
  }

  render() {
    let triggerRows = <tr><td colSpan='3'>Click to create a new Trigger</td></tr>;
    let triggersTable;
    let triggers = this.props.triggers;
    if (triggers && triggers.length > 0) {
      triggerRows = triggers.map((trigger, i) => {
        return (<Trigger
          index={i}
          key={trigger._id}
          trigger={trigger}
          watcherId={this.props.watcherId}
          onCancel={this.onDelete}
        />);
      });
    }
    return (
      <div>
        <h4>Triggers
          <Button
            type='button'
            bsStyle='primary'
            className='pull-right btn-sm'
            onClick={this.onNew}
          >
            New
          </Button>
        </h4>
        <Table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Recipient</th>
              <th>Count</th>
              <th>Last triggered</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {triggerRows}
          </tbody>
        </Table>
      </div>
    );
  }
}

Triggers.propTypes = {
  triggers: React.PropTypes.object.isRequired,
  watcherId: React.PropTypes.object.isRequired,
  addTrigger: React.PropTypes.func.isRequired,
  removeTrigger: React.PropTypes.func.isRequired
};

export default Triggers;
