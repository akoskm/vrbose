import React from 'react';

import classNames from 'classnames';

import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Form from 'react-bootstrap/lib/Form';
import Table from 'react-bootstrap/lib/Table';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';

import triggerRow from './triggerRow';

class Triggers extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      editing: false
    };

    this.onNew = this.onNew.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onNew() {

  }

  onEdit() {
    this.setState({
      editing: true
    });
  }

  onDelete() {

  }

  render() {
    let triggerRows = <tr><td colSpan='3'>Click here to create a new Trigger</td></tr>;
    let triggersTable;
    if (this.props.triggers && this.props.triggers.length > 0) {
      triggerRows = this.props.triggers.map((m) => {
        return <triggerRow trigger={m} watcherId={this.props.watcherId}/>;
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
              <th>Count</th>
              <th>Last triggered</th>
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
  watcherId: React.PropTypes.object.isRequired
};

export default Triggers;
