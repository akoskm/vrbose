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

import MatcherRow from './MatcherRow';

class Summary extends React.Component {

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
    let matcherRows = <tr><td></td></tr>;
    let matchersTable = <Col xs={12} md={12} lg={12}>No entries found</Col>;
    if (this.props.matchers && this.props.matchers.length > 0) {
      matcherRows = this.props.matchers.map((m) => {
        return <MatcherRow matcher={m} watcherId={this.props.watcherId}/>;
      });
      matchersTable = (
        <Col xs={12} md={12} lg={12}>
          <h4>Matcher
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
                <th>Name</th>
                <th>Regex</th>
                <th>Count</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {matcherRows}
            </tbody>
          </Table>
        </Col>
      );
    }
    return matchersTable;
  }
}

Summary.propTypes = {
  matchers: React.PropTypes.object.isRequired,
  watcherId: React.PropTypes.object.isRequired
};

export default Summary;
