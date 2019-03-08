const initialState = {
  isFetching: false,
  errorMessage: null,
  data: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'UNITS_IS_FETCHING':
      return {
        ...state,
        isFetching: true,
        errorMessage: null,
      };
    case 'UNITS_FETCH_HAS_ERRORED':
      return {
        ...state,
        isFetching: false,
        errorMessage: action.errorMessage,
      };
    case 'UNITS_FETCH_DATA_SUCCESS':
      return {
        ...state,
        isFetching: false,
        errorMessage: null,
        data: action.units,
      };

    default:
      return state;
  }
};
