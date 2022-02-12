type itemInMove = {
  origin: string;
  invalidDestinations: string[];
  data: dragList;
}

type treeState = {
  movingItem: itemInMove;
  insertDestination: string;
};

type treeAction = {
  type: string;
  payload: any;
};

type dragList = {
  name: string;
  value?: string;
  children?: dragList[];
}