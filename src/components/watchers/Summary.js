import React from 'react';

import Col from 'react-bootstrap/lib/Col';
import Table from 'react-bootstrap/lib/Table';
import Row from 'react-bootstrap/lib/Row';

const Summary = (props) => {
  let matchersTable = <Col xs={12} md={6} lg={6}>No entries found</Col>;
  if (props.matchers && props.matchers.length > 0) {
    matchersTable = (
    <Col xs={12} md={6} lg={6}>
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
        {props.matchers.map(function (m) {
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
};

Summary.propTypes = {
  matchers: React.PropTypes.object.isRequired
};

export default Summary;
