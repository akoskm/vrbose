import React from 'react';

import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Table from 'react-bootstrap/lib/Table';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

class Summary extends React.Component {
  constructor(props) {
    super(props);

    this.onNew = this.onNew.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onNew() {

  }

  onEdit() {

  }

  onDelete() {

  }

  render() {
    let matchersTable = <Col xs={12} md={12} lg={12}>No entries found</Col>;
    if (this.props.matchers && this.props.matchers.length > 0) {
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
          {this.props.matchers.map((m) => {
            return (
              <tr>
                <td>{m.name}</td>
                <td>{m.regex}</td>
                <td>{m.count}</td>
                <td>
                  <Button
                    type='button'
                    bsStyle='primary'
                    className='btn-xs'
                    onClick={this.onEdit}
                    title='Edit'
                  >
                    <Glyphicon glyph='pencil'/>
                  </Button>
                </td>
                <td>
                  <Button
                    type='button'
                    bsStyle='danger'
                    className='btn-xs'
                    onClick={this.onEdit}
                    title='Edit'
                  >
                    <Glyphicon glyph='remove'/>
                  </Button>
                </td>
              </tr>
            );
          })}
          </tbody>
        </Table>
      </Col>);
    }
    return matchersTable;
  }
}

Summary.propTypes = {
  matchers: React.PropTypes.object.isRequired
};

export default Summary;
