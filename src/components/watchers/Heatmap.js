import React from 'react';
import moment from 'moment';
import request from 'superagent';
import CalendarHeatmap from 'react-calendar-heatmap';

class Heatmap extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let historyUrl = '/api/watchers/' + this.props.watcherId + '/history';
    this.watcherRequest = request.get(historyUrl).end((err, response) => {
      let res = response.body;
      if (res.success) {
        this.setState({
          watcher: res.result
        });
      }
    });
  }

  componentWillUnmount() {
    this.watcherRequest.abort();
    this.socket.disconnect();
  }

  render() {
    let now = moment();
    let numberOfDays = moment().isLeapYear() ? 366 : 365;
    let values = [
      { date: '2016-01-01' },
      { date: '2016-01-22' },
      { date: '2016-01-30' },
      { date: '2016-01-01', count: 1 },
      { date: '2016-01-03', count: 4 },
      { date: '2016-01-06', count: 2 }
    ];
    return (
      <CalendarHeatmap
        endDate={now}
        numDays={numberOfDays}
        values={values}
      />
    );
  }
}

Heatmap.propTypes = {
  watcherId: React.PropTypes.object.isRequired
};

export default Heatmap;
