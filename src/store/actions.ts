export const SET_ITEM_IN_MOVE: string = "SET_ITEM_IN_MOVE";
export const SET_INSERT_DESTINATION: string = "SET_INSERT_DESTINATION";

export const setItemInMove = (item: itemInMove): treeAction => {
    return {
        type: SET_ITEM_IN_MOVE,
        payload: item
    }
}

export const setInsertDestination = (insertDestination: string): treeAction => {
    return {
        type: SET_INSERT_DESTINATION,
        payload: insertDestination
    }
}