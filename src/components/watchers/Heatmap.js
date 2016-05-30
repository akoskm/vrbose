import React from 'react';
import moment from 'moment';
import request from 'superagent';
import CalendarHeatmap from 'react-calendar-heatmap';

class Heatmap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      values: []
    };
  }

  componentDidMount() {
    let historyUrl = '/api/watchers/' + this.props.watcherId + '/history';
    this.watcherRequest = request.get(historyUrl).end((err, response) => {
      let res = response.body;
      if (res.success) {
        this.setState({
          values: res.result
        });
      }
    });
  }

  componentWillUnmount() {
    this.watcherRequest.abort();
    this.socket.disconnect();
  }

  classForValue(value) {
    if (!value || value.count < 0) {
      return 'color-empty';
    }
    return `color-scale-${value.count > 4 ? 4 : value.count}`;
  }

  generateTitle(value) {
    if (!value) {
      return 0;
    }
    return value.count;
  }

  render() {
    let now = moment();
    let numberOfDays = moment().isLeapYear() ? 366 : 365;
    let values = this.state.values;
    return (
      <CalendarHeatmap
        endDate={now}
        numDays={numberOfDays}
        values={values}
        classForValue={this.classForValue}
        onClick={this.props.filterDay}
      />
    );
  }
}

Heatmap.propTypes = {
  watcherId: React.PropTypes.object.isRequired,
  filterDay: React.PropTypes.object.isRequired
};

export default Heatmap;
