import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Hierarchy from "./components/Hierarchy";
import theme from "./themes/themes";
import { Topbar } from "./components";
import { appWindow } from "@tauri-apps/api/window";

window.document.body.style.backgroundColor = theme.bg;
const HEIGHT = 40;

appWindow.listen("tauri://close-requested", () => {
  invoke("tmp_function");
});


function App() {
  const [, forceUpdate] = useState<number>(0);
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

export default App;
