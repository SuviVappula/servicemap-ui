import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { getHighlightedDistrict, getFilteredSubdistrictUnits } from '../../redux/selectors/district';
import { getSelectedUnit } from '../../redux/selectors/selectedUnit';
import { getLocaleString } from '../../redux/selectors/locale';
import { setMapRef } from '../../redux/actions/map';
import { setAddressLocation } from '../../redux/actions/address';
import { findUserLocation } from '../../redux/actions/user';
import MapView from './MapView';
import { getServiceUnits } from '../../redux/selectors/service';
import { getProcessedData } from '../../redux/selectors/results';
import { getAddressNavigatorParamsConnector } from '../../utils/address';
import { getServiceTreeUnits } from '../../redux/selectors/serviceTree';

// Get redux states as props to component
const mapStateToProps = (state) => {
  const {
    address, navigator, settings, user, measuringMode, serviceTree,
  } = state;
  const unitList = getProcessedData(state);
  const unitsLoading = state.service.isFetching || state.units.isFetching;
  const serviceUnits = getServiceUnits(state);
  const serviceTreeUnitsReducer = serviceTree.serviceTreeUnits;
  const serviceTreeUnitData = getServiceTreeUnits(state);
  const highlightedDistrict = getHighlightedDistrict(state);
  const highlightedUnit = getSelectedUnit(state);
  const {
    customPosition, locale, page, position,
  } = user;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const { adminDistricts, units, toRender } = address;
  const districtUnits = getFilteredSubdistrictUnits(state);
  const getAddressNavigatorParams = getAddressNavigatorParamsConnector(getLocaleText, locale);
  const userLocation = customPosition.coordinates || position.coordinates;
  return {
    addressUnits: units,
    addressToRender: toRender,
    adminDistricts,
    highlightedDistrict,
    highlightedUnit,
    getAddressNavigatorParams,
    getLocaleText,
    unitList,
    serviceUnits,
    districtUnits,
    serviceTreeUnitData,
    serviceTreeUnitsReducer,
    unitsLoading,
    currentPage: page,
    userLocation,
    hideUserMarker: customPosition.hideMarker,
    settings,
    navigator,
    locale,
    measuringMode,
  };
};

export default withRouter(injectIntl(connect(
  mapStateToProps,
  { setMapRef, setAddressLocation, findUserLocation },
)(MapView)));
