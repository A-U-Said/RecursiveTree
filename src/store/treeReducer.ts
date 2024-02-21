import { SET_ITEM_IN_MOVE, TreeActionType, SET_INSERT_DESTINATION } from './actions'

const INITIAL_STATE: treeState = {
    movingItem: { 
        origin: "", 
        invalidDestinations: [], 
        data: {
            name: "", 
            value: "", 
            children: []
        } 
    },
    insertDestination: ""
}

const treeReducer = (state: treeState = INITIAL_STATE, action: TreeActionType): treeState => {
  switch (action.type) {

    case SET_ITEM_IN_MOVE:
        return { 
            ...state, 
            movingItem: action.payload 
        };

    case SET_INSERT_DESTINATION:
        return {
            ...state, 
            insertDestination: action.payload
        };

    default:
        return state;
    }
};

export default treeReducer;
