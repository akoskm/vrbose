import React from 'react';
import moment from 'moment';
import request from 'superagent';
import CalendarHeatmap from 'react-calendar-heatmap';

class Heatmap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activites: [],
      maxScale: 4
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
          max: res.result.max,
          step: Math.floor(res.result.max / this.state.maxScale)
        });
      }
    });
  }

  componentWillUnmount() {
    this.watcherRequest.abort();
  }

  classForValue(value) {
    if (!value || value.total < 0) {
      return 'color-empty';
    }
    let scale = Math.floor(value.total / this.state.step) + 1;
    return `color-scale-${scale > this.state.maxScale ? this.state.maxScale : scale}`;
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
