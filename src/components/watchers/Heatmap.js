import React from 'react';
import moment from 'moment';
import request from 'superagent';
import CalendarHeatmap from 'react-calendar-heatmap';

class Heatmap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activites: []
    };

    this.classForValue = this.classForValue.bind(this);
  }

  componentDidMount() {
    let historyUrl = '/api/watchers/' + this.props.watcherId + '/activity';
    this.watcherRequest = request.get(historyUrl).end((err, response) => {
      let res = response.body;
      if (res.success) {
        this.setState({
          activites: res.result.activites,
          max: res.result.max
        });
      }
    });
  }

  componentWillUnmount() {
    this.watcherRequest.abort();
    this.socket.disconnect();
  }

  classForValue(value) {
    if (!value || value.total < 0) {
      return 'color-empty';
    }
    let step = Math.floor(this.state.max / 4);
    console.log('>>>>>>>>>', step);
    let scale = Math.floor(value.total / step);
    console.log(scale);
    return `color-scale-${scale > 4 ? 4 : scale}`;
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
    let activites = this.state.activites;
    return (
      <CalendarHeatmap
        endDate={now}
        numDays={numberOfDays}
        values={activites}
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
