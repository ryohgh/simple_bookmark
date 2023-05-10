import { useState } from "react";
import Hierarchy from "./components/Hierarchy";
import theme from "./themes/themes";
import { ConfirmMordal, Topbar } from "./components";
import { structureFunctions } from "./functions";

window.document.body.style.backgroundColor = theme.bg;
const HEIGHT = 40;

let hierarchyState = false;

structureFunctions.fetchStructure().then(() => {
  ;
  console.log("success!");
}).catch(err => {
  // handling when error of fetching structure occurs 
  setHierarchyState(true);
});

function App() {
  const [, forceUpdate] = useState(0);
  function update() {
    forceUpdate(prevState => prevState + 1);
    return
  }


  return (<>
    <Topbar
      update={update}
      height={HEIGHT}
    />
    {hierarchyState &&
      <Hierarchy
        height={HEIGHT}
      />
    }
    <ConfirmMordal
    />
  </>);
}

export default App;
