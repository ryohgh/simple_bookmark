// external modules (including standard libraries)
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::fs::{self, File};
use std::io::{Read, Write};

#[derive(Debug, Deserialize, Serialize)]
pub struct BookmarkStructure {
    block_type: String,
    block_name: String,
    block_pos: Vec<u32>,
    block_children: Vec<Option<BookmarkStructure>>,
    block_url: Option<String>,
}

impl Clone for BookmarkStructure {
    fn clone(&self) -> Self {
        BookmarkStructure {
            block_type: self.block_type.clone(),
            block_name: self.block_name.clone(),
            block_pos: self.block_pos.clone(),
            block_children: self.block_children.clone(),
            block_url: self.block_url.clone(),
        }
    }
}

#[derive(Debug, Deserialize, Serialize)]
struct Bookmark {
    bookmark_structure: Vec<BookmarkStructure>,
}

fn get_path() -> String {
    // this path is temporary so this will be modified when I publish.
    let path = String::from("/home/ryozk/src/simple_bookmark/simpe-bookmark-client/resources/bookmark.json");
    path
}

pub fn save_structure(bookmark_structure_json: &String) -> Result<(), Box<dyn std::error::Error>> {
    let mut file = File::create(get_path())?;
    let contents = bookmark_structure_json.clone();
    file.write_all(contents.as_bytes())?;
    file.flush()?;
    Ok(())
}

pub fn fetch_structure() -> Result<String, Box<dyn std::error::Error>> {
    let mut file = File::open(get_path())?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}
