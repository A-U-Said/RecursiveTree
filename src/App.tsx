import Tree from "./components/Tree";
import TreeData from "./components/TreeData";

const App = (): JSX.Element => {

  const onChange = (message: string): void => {
    console.log(message);
  }

  return (
    <div className="App">
      <h1>Dragover for 0.75s to insert as child or drop immediately to add as sibling</h1>
      <Tree members={TreeData} onChange={onChange}/>
    </div>
  );
};

export default App;
