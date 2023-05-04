import Hierarchy from "./components/Hierarchy";
import theme from "./themes/themes";
import { Topbar } from "./components";
import { useState } from "react";

window.document.body.style.backgroundColor = theme.bg;
const HEIGHT = 40;

function App(): JSX.Element {
  const [,forceUpdate] = useState<number>(0);
  function update() {
    forceUpdate(prevState => prevState + 1);
    return
  }
  return (<>
    <Topbar 
      update={update}
      height={HEIGHT} 
    />
    <Hierarchy
      height={HEIGHT}
    />
  </>);
}

export default App
