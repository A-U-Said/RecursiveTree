import { createStore, Store, compose } from "redux";
import treeReducer from "./treeReducer";

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store: Store<treeState, treeAction> = createStore(treeReducer, composeEnhancers());

export type IRootState = ReturnType<typeof treeReducer>;
export default store;