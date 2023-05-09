// external modules (including standard libraries)
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct BookmarkStructure {
    block_type: String,
    block_name: String,
    block_pos: Vec<u32>,
    block_children: Vec<Option<BookmarkStructure>>,
    block_url: Option<String>,
}

