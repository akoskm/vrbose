import React from 'react';

import Col from 'react-bootstrap/lib/Col';
import Table from 'react-bootstrap/lib/Table';
import Row from 'react-bootstrap/lib/Row';
import Button from 'react-bootstrap/lib/Button';

class Summary extends React.Component {
  constructor(props) {
    super(props);
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
            onClick={this.saveWatcher}
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
            </tr>
          </thead>
          <tbody>
          {this.props.matchers.map(function (m) {
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
    return matchersTable;
  }
}

Summary.propTypes = {
  matchers: React.PropTypes.object.isRequired
};

export default Summary;
