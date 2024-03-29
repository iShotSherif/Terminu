// reducers/chartReducer.js
const initialState = {
  chartIds: [],
  chartData: {},
};

const chartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_CHART':
      if (!state.chartIds.includes(action.payload)) {
        return {
          ...state,
          chartIds: [...state.chartIds, action.payload],
        };
      } else {
        return state;
      }
    case 'REMOVE_CHART':
      return {
        ...state,
        chartIds: state.chartIds.filter(id => id !== action.payload),
      };
    case 'POPOUT_CHART':
      return {
        ...state,
        chartIds: state.chartIds.filter(id => id !== action.payload),
        popoutChartId: action.payload,
      };
      
    default:
      return state;
  }
  
};

export default chartReducer;