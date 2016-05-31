import React from 'react';

import request from 'superagent';
import classNames from 'classnames';

import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import FormControl from 'react-bootstrap/lib/FormControl';

class MatcherRow extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      matcher: null
    };

    this.onEdit = this.onEdit.bind(this);
    this.onSave = this.onSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onEdit() {
    this.setState({
      editing: true,
      matcher: this.props.matcher
    });
  }

  onSave() {
    let matcher = this.state.matcher;
    let url = '/api/watchers/' + this.props.watcherId + '/matchers/' + matcher._id;
    request.put(url).send({
      name: matcher.name,
      regex: matcher.regex
    }).end((err, response) => {
      let res = response.body;
      if (res.success) {
        this.setState({
          editing: false,
          matcher: null
        });
      }
    });
  }

  handleChange(e) {
    let target = e.target;
    if (!e.target.attributes || !e.target.attributes.getNamedItem('data-prop')) {
      throw 'data-prop isn\'t found on ' + target.outerHTML;
    }
    let key = target.attributes.getNamedItem('data-prop').value;
    let newState = this.state.matcher;
    newState[key] = target.value;
    this.setState({
      matcher: newState
    });
  }

  render() {
    let matcher = this.props.matcher;
    let inputClass = classNames({
      'input-sm': true,
      'input-editable': true,
      'input-editing': this.state.editing
    });
    let primaryTitle = 'Edit';
    let primaryIcon = 'pencil';
    let primaryFunction = this.onEdit;
    if (this.state.editing) {
      primaryIcon = 'ok';
      primaryTitle = 'Save';
      primaryFunction = this.onSave;
    }
    return (
      <tr>
        <td>
          <FormControl
            type='text'
            data-prop='name'
            value={matcher.name}
            className={inputClass}
            onChange={this.handleChange}
            disabled={!this.state.editing}
          />
        </td>
        <td>
          <FormControl
            type='text'
            data-prop='regex'
            value={matcher.regex}
            className={inputClass}
            onChange={this.handleChange}
            disabled={!this.state.editing}
          />
        </td>
        <td>{matcher.count}</td>
        <td>
          <Button
            type='button'
            bsStyle='primary'
            className='btn-xs'
            onClick={primaryFunction}
            title={primaryTitle}
          >
            <Glyphicon glyph={primaryIcon}/>
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
  }
}

MatcherRow.propTypes = {
  watcherId: React.PropTypes.object.isRequired,
  matcher: React.PropTypes.object.isRequired
};

export default MatcherRow;
