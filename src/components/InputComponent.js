import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';

class InputComponent extends React.Component {

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.props.onChange(event.target.name, event.target.value);
  }

  render() {
    const input = this.props;
    return (
      <FormGroup controlId='id'>
        <Col componentClass={ControlLabel} sm={2}>
          {input.label}
        </Col>
        <Col sm={10}>
          <FormControl
            id={input.id}
            name={input.name}
            type={input.type}
            value={input.value}
            onChange={this.onChange}
          />
        </Col>
      </FormGroup>
    );
  }
}

InputComponent.propTypes = {
  value: React.PropTypes.object.isRequired,
  onChange: React.PropTypes.func.isRequired
};

export default InputComponent;
