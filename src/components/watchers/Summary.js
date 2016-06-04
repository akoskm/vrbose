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

const Summary = (props) => {
  let matcherRows = <tr><td></td></tr>;
  let matchersTable = <Col xs={12} md={12} lg={12}>No entries found</Col>;
  if (props.matchers && props.matchers.length > 0) {
    matchersTable = (
      <Col xs={12} md={12} lg={12}>
        <h4>Matchers</h4>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Regex</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {props.matchers.map((m) => {
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
      </Col>
    );
  }
  return matchersTable;
};

Summary.propTypes = {
  matchers: React.PropTypes.object.isRequired,
  watcherId: React.PropTypes.object.isRequired
};

export default Summary;
