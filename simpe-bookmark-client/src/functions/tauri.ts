import { appWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/";

appWindow.listen("tauri://close-requested", () => {
    invoke("tmp_function");
});
