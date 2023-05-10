// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// internal modules
mod bookmark;
use bookmark::BookmarkStructure;

// external modules (including std libraries)
use serde_json::{json, Value};
use std::fs::{self, File};
use std::io::{self, Read, Write};

// tauri APIs
#[tauri::command]
fn save_structure(bookmark_structure_json: String) -> Result<(), String> {
    println!("{}", bookmark_structure_json);
    let result = bookmark::save_structure(&bookmark_structure_json);
    match result {
        Err(err) => {
            let error_string = format!("failed to save bookmark structure: \n{}", err.to_string());
            println!("{}", error_string);
            return Err(error_string);
        }
        Ok(()) => return Ok(()),
    }
}

#[tauri::command]
fn fetch_structure() -> Result<String, String> {
    let result = bookmark::fetch_structure();
    match result {
        Ok(contents) => return Ok(contents),
        Err(err) => {
            let error_string = format!("failed to fetch bookmark structure: \n{}", err.to_string());
            println!("{}", error_string);
            return Err(error_string);
        }
    }
}

#[tauri::command]
fn tmp_function() {
    println!("before closing");
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![fetch_structure, save_structure, tmp_function])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
