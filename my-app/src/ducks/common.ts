//actionType
const REDUX = 'redux';

// initialSate
const initialState = () => ({
  redux: 'init',
});

interface IAction {
  type: string;
  data: any;
}

// Reducer
export default function reducer(state = initialState(), action: IAction) {
  switch (action.type) {
    case REDUX:
      return Object.assign({}, state, {
        redux: action.data,
      });
    default:
      return state;
  }
}

// update
export const updateRedux = data => {
  return {
    type: REDUX,
    data,
  };
};
