import React from 'react';
import request from 'superagent';
import Table from 'react-bootstrap/lib/Table';
import Button from 'react-bootstrap/lib/Button';

class WatchersComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      watchers: []
    };

    this.newWatcher = this.newWatcher.bind(this);
    this.openWatcher = this.openWatcher.bind(this);
  }

  componentDidMount() {
    this.watchersRequest = request.get('/api/watchers/').end(function (err, response) {
      let res = response.body;
      if (res.success) {
        this.setState({
          watchers: res.result
        });
      }
    }.bind(this));
  }

  componentWillUnmount() {
    this.watchersRequest.abort();
  }

  newWatcher() {
    this.props.history.pushState(null, '/watchers/new');
  }

  openWatcher(e) {
    let id = e.target.attributes.getNamedItem('data-id').value;
    this.props.history.pushState(null, '/watchers/' + id);
  }

  render() {
    return (
      <div>
        <Button bsStyle='primary' onClick={this.newWatcher}>New</Button>
        <Table responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Name</th>
              <th>Last Match</th>
              <th>Filename</th>
              <th>Description</th>
              <th>Total</th>
              <th/>
            </tr>
          </thead>
          <tbody>
          {this.state.watchers.map((watcher, i) => {
            return (
              <tr>
                <td>{i}</td>
                <td>{watcher.id}</td>
                <td>{watcher.name}</td>
                <td>{watcher.lastMatch}</td>
                <td>{watcher.filename}</td>
                <td>{watcher.description}</td>
                <td>{watcher.total}</td>
                <td><a onClick={this.openWatcher} data-id={watcher._id}>Edit</a></td>
              </tr>
            );
          })}
          </tbody>
        </Table>
      </div>
    );
  }
}

WatchersComponent.propTypes = {
  history: React.PropTypes.object.isRequired
};

export default WatchersComponent;
