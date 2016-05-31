import React from 'react';
import request from 'superagent';
import io from 'socket.io-client';

import Heatmap from './Heatmap';
import Timeline from './Timeline';

import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Button from 'react-bootstrap/lib/Button';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

class WatcherComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      watcher: {}
    };

    this.filterDay = this.filterDay.bind(this);
    this.getWatcher = this.getWatcher.bind(this);
    this.updateWatcher = this.updateWatcher.bind(this);
    this.configureWatcher = this.configureWatcher.bind(this);
  }

  componentDidMount() {
    this.getWatcher();

    this.socket = io('/ws/watchers/' + this.props.routeParams.id);
    this.socket.on('connect', function () {
      console.log('connected to watcher socket');
    });
    this.socket.on('message', this.updateWatcher);
  }

  componentWillUnmount() {
    this.watcherRequest.abort();
    this.socket.disconnect();
  }

  getWatcher(forDay) {
    let url = '/api/watchers/' + this.props.routeParams.id;
    if (forDay) {
      url = url + '?d=' + forDay;
    }
    this.watcherRequest = request.get(url).end((err, response) => {
      let res = response.body;
      if (res.success) {
        this.setState({
          watcher: res.result
        });
      }
    });
  }

  updateWatcher(message) {
    if (message && this.state.watcher.matchers) {
      let matcher = this.state.watcher.matchers.find((curr, i) => {
        return message.name === curr.name;
      });
      if (matcher) {
        matcher.count = matcher.count + message.history.total;
        if (!matcher.history) matcher.history = [];
        matcher.history.push(message.history);
        this.setState({
          watcher: this.state.watcher
        });
      }
    }
  }

  filterDay(value) {
    if (value) {
      this.getWatcher(value.date);
    }
  }

  configureWatcher() {
    let url = '/watchers/' + this.props.routeParams.id + '/edit';
    this.props.history.pushState(null, url);
  }

  render() {
    let watcher = this.state.watcher;
    let heatmap = (<p>Loading</p>);
    if (watcher._id) {
      heatmap = (<Heatmap watcherId={watcher._id} filterDay={this.filterDay}/>);
    }
    let timelines = <p>No data.</p>;
    if (watcher.matchers && watcher.matchers.length > 0) {
      timelines = watcher.matchers.map((m, i) => {
        return (
          <Col md={12} lg={6} xs={12}>
            <h4>{m.name}</h4>
            <Timeline
              history={m.history}
              index={i}
            />
          </Col>
        );
      });
    }
    return (
      <div>
        <Row>
          <Col sm={12}>
            <h1>{this.state.watcher.name}
              <Button
                type='button'
                bsStyle='primary'
                className='pull-right'
                onClick={this.configureWatcher}
              >
                <Glyphicon glyph='wrench'/> Configure
              </Button>
            </h1>
          </Col>
        </Row>
        <Row>
          {timelines}
        </Row>
        <Row>
          {heatmap}
        </Row>
      </div>
    );
  }
}

WatcherComponent.propTypes = {
  params: React.PropTypes.object.isRequired,
  routeParams: React.PropTypes.object.isRequired,
  history: React.PropTypes.object.isRequired
};

export default WatcherComponent;
