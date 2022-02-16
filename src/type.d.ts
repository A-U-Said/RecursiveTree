type itemInMove = {
  origin: string;
  invalidDestinations: string[];
  data: dragList;
}

type treeState = {
  movingItem: itemInMove;
  insertDestination: string;
};

type treeAction<T> = {
  type: string;
  payload: T;
};

type dragList = {
  name: string;
  value?: string;
  children?: dragList[];
}