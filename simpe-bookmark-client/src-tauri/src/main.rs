// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// internal modules
mod bookmark;

use bookmark::BookmarkStructure;

// external modules (including std libraries)

// tauri APIs
#[tauri::command]
fn store_bookmark_info(bookmark_structure_json: String) -> Result<String, String> {
    let convert_result = serde_json::from_str::<Vec<BookmarkStructure>>(&bookmark_structure_json);
    let bookmark_structure = match convert_result {
        Ok(structure) => structure,
        Err(err) => return Err(format!("bookmark structure convertasion failed {}", err)),
    };
    println!("{:?}", bookmark_structure);
    Ok(format!("").into())
}

#[tauri::command]
fn tmp_function() {
    println!("before closing");
}

fn main() {

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![store_bookmark_info,tmp_function])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
