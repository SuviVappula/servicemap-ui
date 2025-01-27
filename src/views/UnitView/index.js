import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import { fetchSelectedUnit, changeSelectedUnit } from '../../redux/actions/selectedUnit';
import { fetchAccessibilitySentences } from '../../redux/actions/selectedUnitAccessibility';
import { fetchHearingMaps } from '../../redux/actions/selectedUnitHearingMaps';
import { fetchUnitEvents } from '../../redux/actions/selectedUnitEvents';
import { fetchReservations } from '../../redux/actions/selectedUnitReservations';

import UnitView from './UnitView';
import styles from './styles/styles';
import { calculateDistance, getCurrentlyUsedPosition } from '../../redux/selectors/unit';
import { formatDistanceObject } from '../../utils';

// Listen to redux state
const mapStateToProps = (state, props) => {
  const { intl } = props;
  const stateUnit = state.selectedUnit.unit.data;
  const currentPosition = getCurrentlyUsedPosition(state);
  const unitFetching = state.selectedUnit.unit.isFetching;
  const {
    accessibilitySentences, events, reservations, hearingMaps,
  } = state.selectedUnit;
  const { navigator, user } = state;

  return {
    accessibilitySentences: accessibilitySentences.data,
    distance: formatDistanceObject(intl, calculateDistance(stateUnit, currentPosition)),
    stateUnit,
    unitFetching,
    eventsData: events,
    navigator,
    reservationsData: reservations,
    userLocation: user.position,
    hearingMaps: hearingMaps.data,
  };
};

export default withRouter(injectIntl(withStyles(styles)(connect(
  mapStateToProps,
  {
    changeSelectedUnit,
    fetchSelectedUnit,
    fetchUnitEvents,
    fetchAccessibilitySentences,
    fetchReservations,
    fetchHearingMaps,
  },
)(UnitView))));
