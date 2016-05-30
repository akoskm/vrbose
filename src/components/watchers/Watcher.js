import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import request from 'superagent';
import io from 'socket.io-client';
import Summary from './Summary';
import Heatmap from './Heatmap';
import Timeline from './Timeline';

class WatcherComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      watcher: {
        name: 'New Watcher'
      }
    };

    this.filterDay = this.filterDay.bind(this);
    this.saveWatcher = this.saveWatcher.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateWatcher = this.updateWatcher.bind(this);
  }

  componentDidMount() {
    let watcherId = this.props.routeParams.id;
    this.watcherRequest = request.get('/api/watchers/' + watcherId).end((err, response) => {
      let res = response.body;
      if (res.success) {
        this.setState({
          watcher: res.result
        });
      }
    });

    this.socket = io('/ws/watchers/' + watcherId);
    this.socket.on('connect', function () {
      console.log('connected to watcher socket');
    });
    this.socket.on('message', this.updateWatcher);
  }

  componentWillUnmount() {
    this.watcherRequest.abort();
    this.socket.disconnect();
  }

  updateWatcher(message) {
    if (message && this.state.watcher.matchers) {
      // let wsMatchers = message.matchers;
      let matcher = this.state.watcher.matchers.find((curr, i) => {
        return message.name === curr.name;
      });
      if (matcher) {
        matcher.count = matcher.count + message.history.total;
        matcher.history.push(message.history);
        this.setState({
          watcher: this.state.watcher
        });
      }
    }
  }

  saveWatcher() {
    console.log(this.state);
  }

  handleChange(e) {
    let target = e.target;
    if (!e.target.attributes || !e.target.attributes.getNamedItem('data-prop')) {
      throw 'data-prop isn\'t found on ' + target.outerHTML;
    }
    let key = target.attributes.getNamedItem('data-prop').value;
    let newState = {};
    newState[key] = target.value;
    this.setState({
      watcher: newState
    });
  }

  filterDay(value) {
    if (value) {
      this.setState({
        forDay: value.date
      });
    }
  }

  render() {
    let watcher = this.state.watcher;
    let buttonText = 'Create';
    let heatmap = (<p>Loading</p>);
    if (watcher._id) {
      buttonText = 'Save';
      heatmap = (<Heatmap watcherId={watcher._id} filterDay={this.filterDay}/>);
    }
    let timelines = <p>No data.</p>;
    if (watcher.matchers && watcher.matchers.length > 0) {
      timelines = watcher.matchers.map((m, i) => {
        return (
          <Col md={6} lg={6} xs={6}>
            <h4>{m.name}</h4>
            <Timeline
              forDay={this.state.forDay}
              watcherId={watcher._id}
              matcherId={m._id}
              index={i}
            />
          </Col>
        );
      });
    }
    return (
      <div>
        <Row>
          <Col xs={12} md={6} lg={6}>
            <h4>{watcher.name}</h4>
            <Form horizontal>
              <FormGroup controlId='id'>
                <Col componentClass={ControlLabel} sm={2}>
                  ID
                </Col>
                <Col sm={10}>
                  <FormControl
                    type='text'
                    placeholder='AWSM-WTCHR-1'
                    onChange={this.handleChange}
                    data-prop='id'
                    value={watcher.id}
                  />
                  <HelpBlock>Must be Unique</HelpBlock>
                </Col>
              </FormGroup>

              <FormGroup controlId='name'>
                <Col componentClass={ControlLabel} sm={2}>
                  Name
                </Col>
                <Col sm={10}>
                  <FormControl
                    type='text'
                    placeholder='Awesome watcher'
                    onChange={this.handleChange}
                    data-prop='name'
                    value={watcher.name}
                  />
                  <HelpBlock>Be more descriptive here</HelpBlock>
                </Col>
              </FormGroup>

              <FormGroup controlId='filename'>
                <Col componentClass={ControlLabel} sm={2}>
                  Filename
                </Col>
                <Col sm={10}>
                  <FormControl
                    type='text'
                    placeholder='/var/log/vrbose.log'
                    onChange={this.handleChange}
                    data-prop='filename'
                    value={watcher.filename}
                  />
                  <HelpBlock>File to watch</HelpBlock>
                </Col>
              </FormGroup>

              <FormGroup className='pull-right'>
                <Col sm={12}>
                  <Button type='button' onClick={this.saveWatcher}>
                    {buttonText}
                  </Button>
                </Col>
              </FormGroup>
            </Form>
          </Col>
          <Summary matchers={watcher.matchers}/>
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
  routeParams: React.PropTypes.object.isRequired
};

export default WatcherComponent;
