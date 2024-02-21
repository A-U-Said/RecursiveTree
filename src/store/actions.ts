export const SET_ITEM_IN_MOVE = "SET_ITEM_IN_MOVE";
export const SET_INSERT_DESTINATION = "SET_INSERT_DESTINATION";


type setItemInMoveType = {
    type: "SET_ITEM_IN_MOVE",
    payload: itemInMove
}
export const setItemInMove = (item: itemInMove): setItemInMoveType => {
    return {
        type: SET_ITEM_IN_MOVE,
        payload: item
    }
}


type setInsertDestinationType = {
    type: "SET_INSERT_DESTINATION",
    payload: string
}
export const setInsertDestination = (insertDestination: string): setInsertDestinationType => {
    return {
        type: SET_INSERT_DESTINATION,
        payload: insertDestination
    }
}


export type TreeActionType = setItemInMoveType | setInsertDestinationType;