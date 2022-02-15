import { useEffect, useState } from "react";
import Tree from "./components/Tree";
import TreeData from "./components/TreeData";
import beehiveLogo from './beehive.svg';

const App = (): JSX.Element => {

  const [treeMembers, setTreeMembers] = useState<dragList[] | null>(null);

  const fetchMembers = (): Promise<dragList[]> => {
    const fetchedTreeMembers = TreeData;
    return Promise.resolve(fetchedTreeMembers);
  };

  useEffect(() => {
    setTimeout(() => fetchMembers().then(members => { setTreeMembers(members) }), 1000); //simulate get
  }, [])

  const loading: JSX.Element = <img className="loading-logo" src={beehiveLogo}  alt="Beehive honeycomb logo"></img>;

  const onChange = (message: string): void => {
    console.log(message);
  }

  return (
    <div className="App">
      <h1>Dragover for 0.75s to insert as child or drop immediately to add as sibling</h1>
      { !treeMembers && loading }
      { treeMembers && <Tree members={treeMembers} onChange={onChange}/> }
    </div>
  );
};

export default App;
