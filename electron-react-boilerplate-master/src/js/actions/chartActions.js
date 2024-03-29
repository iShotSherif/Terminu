// actions/chartActions.js
export const addChart = chartId => {
  return {
    type: 'ADD_CHART',
    payload: chartId,
  };
};

export const removeChart = chartId => {
  return {
    type: 'REMOVE_CHART',
    payload: chartId,
  };
};

export const popoutChart = chartId => {
  return {
    type: 'POPOUT_CHART',
    payload: chartId,
  };
};
