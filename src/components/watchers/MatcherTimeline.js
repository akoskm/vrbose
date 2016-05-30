import React from 'react';
import moment from 'moment';
import request from 'superagent';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
const LineChart = require('react-chartjs').Bar;

class MatcherTimeline extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      history: [],
      forDay: null
    };

    this.loadTimeline = this.loadTimeline.bind(this);
  }

  componentDidMount() {
    this.loadTimeline();
  }

  componentWillReceiveProps(newProps) {
    if (newProps && newProps.forDay) {
      this.loadTimeline(newProps.forDay);
    }
  }

  componentWillUnmount() {
    this.watcherRequest.abort();
    this.socket.disconnect();
  }

  loadTimeline(forDay) {
    let watcherId = this.props.watcherId;
    let matcherId = this.props.matcherId;
    let historyURL = '/api/watchers/' + watcherId + '/matchers/' + matcherId;
    if (forDay) {
      historyURL = historyURL + '?d=' + forDay;
    }
    this.watcherRequest = request.get(historyURL).end((err, response) => {
      let res = response.body;
      if (res.success) {
        this.setState({
          history: res.result,
          forDay
        });
      }
    });
  }

  render() {
    const primaryColors = [
      'rgba(194, 118, 218, 1)',
      'rgba(209, 154, 102, 1)',
      'rgba(167, 91, 102, 1)'
    ];

    const secondaryColors = [
      'rgba(194, 118, 218, 0.2)',
      'rgba(209, 154, 102, 0.2)',
      'rgba(167, 91, 102, 0.2)'
    ];

    // make these configurable
    const resolution = 30;
    const iterations = 10;

    let dataSet = [];
    let labelsText = [];

    let oldTime;
    let startTime = moment();
    let currentTime = moment();
    const isBetween = (h) => {
      let createdOn = moment(h.createdOn);
      return createdOn.isBetween(startTime, oldTime);
    };

    let history = this.state.history;
    if (history && history.length > 0) {
      let last = history[history.length - 1];
      if (last) {
        startTime = moment(currentTime);
        for (let i = 0; i < iterations; i++) {
          oldTime = moment(startTime);
          startTime.subtract(resolution, 'm').startOf('hour');
          labelsText.unshift(startTime.format('HH:mm') + ' - ' + oldTime.format('HH:mm'));

          let between = history.filter(isBetween);
          let total = between.reduce(function (prev, curr) {
            return prev + curr.total;
          }, 0);
          dataSet.unshift(total);
        }
      }

      let options = {
        responsive: true,
        maintainAspectRatio: true
      };

      let data = {
        labels: labelsText,
        datasets: [{
          label: 'My First dataset',
          fillColor: secondaryColors[this.props.index],
          strokeColor: primaryColors[this.props.index],
          pointColor: primaryColors[this.props.index],
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)',
          data: dataSet
        }]
      };

      return (
        <div>
          <LineChart data={data} options={options}/>
        </div>
      );
    } else {
      return <div>no data</div>;
    }
  }

}

MatcherTimeline.propTypes = {
  watcherId: React.PropTypes.object.isRequired,
  matcherId: React.PropTypes.object.isRequired,
  forDay: React.PropTypes.object.isRequired,
  index: React.PropTypes.object.isRequired
};

export default MatcherTimeline;
