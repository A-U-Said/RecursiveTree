type itemInMove = {
  origin: string;
  invalidDestinations: string[];
  data: dragList;
}

type treeState = {
  movingItem: itemInMove;
  insertDestination: string;
};

type treeAction<TreeActionType, TValue> = {
  type: TreeActionType;
  payload: TValue;
};

type dragList = {
  name: string;
  value?: string;
  children?: dragList[];
}