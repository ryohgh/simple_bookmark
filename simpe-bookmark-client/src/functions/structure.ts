import { BookmarkBlock } from "../interfaces";
import compareList from "./compareList";
import { invoke } from "@tauri-apps/api/tauri";

let structure: BookmarkBlock[] = [];

function getStructure(): BookmarkBlock[] {
  return structure;
}

// function triggers storing bookmark information to the json file.
async function storeBookmarkStructure() {
  const bookmarkStructureJson = JSON.stringify(getStructure());
  invoke("store_bookmark_info", { bookmarkStructureJson })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
  return;
}

function search(pos: number[]): {
  foundBlock: BookmarkBlock | undefined;
  isFailed: boolean;
} {
  let children: BookmarkBlock[] | undefined = structure;
  for (let i = 1; i <= pos.length; i++) {
    const result = searchEachLayer(children, pos.slice(0, i));
    if (result.isFailed) {
      return {
        foundBlock: undefined,
        isFailed: true,
      };
    }
    if (result.isFound) {
      return {
        foundBlock: result.foundBlock,
        isFailed: false,
      };
    }
    children = result.children;
  }
  return {
    foundBlock: undefined,
    isFailed: true,
  };

  function searchEachLayer(
    children: BookmarkBlock[] | undefined,
    parentPos: number[]
  ): {
    isFailed: boolean;
    isFound: boolean;
    children: BookmarkBlock[] | undefined;
    foundBlock: BookmarkBlock | undefined;
  } {
    if (typeof children !== "undefined") {
      for (const value of children) {
        if (compareList(value.block_pos, parentPos)) {
          if (compareList(value.block_pos, pos)) {
            return {
              isFailed: false,
              isFound: true,
              foundBlock: value,
              children: value.block_children,
            };
          }
          return {
            isFailed: false,
            isFound: false,
            foundBlock: undefined,
            children: value.block_children,
          };
        }
      }
      return {
        isFailed: true,
        isFound: false,
        foundBlock: undefined,
        children: undefined,
      };
    }
    return {
      isFailed: true,
      isFound: false,
      foundBlock: undefined,
      children: undefined,
    };
  }
}

function addBlock(
  pos: number[],
  type: string,
  name: string,
  url: string | undefined
) {
  if (compareList(pos, [0])) {
    let lastId: number;
    if (structure.length > 0) {
      lastId = structure[structure.length - 1].block_pos[0];
    } else {
      lastId = 1;
    }
    const newBlock: BookmarkBlock = {
      block_pos: [lastId + 1],
      block_type: type,
      block_name: name,
      block_url: url,
      block_children: [],
    };
    structure.push(newBlock);
    // tmp
    storeBookmarkStructure();
    //
    return;
  } else {
    const result = search(pos);
    if (result.isFailed) {
      return;
    }
    const currentFolder = result.foundBlock;
    if (currentFolder?.block_type === "folder") {
      if (currentFolder.block_children !== undefined) {
        const lastChild =
          currentFolder.block_children[currentFolder.block_children.length - 1];
        let lastChildId: number;
        if (lastChild === undefined) {
          lastChildId = 1;
        } else {
          lastChildId = lastChild.block_pos[lastChild.block_pos.length - 1] + 1;
        }
        const newPos: number[] = [];
        for (let i = 0; i < pos.length; i++) {
          newPos.push(pos[i]);
        }
        newPos.push(lastChildId);
        const newBlock: BookmarkBlock = {
          block_pos: newPos,
          block_type: type,
          block_name: name,
          block_url: url,
          block_children: [],
        };
        currentFolder.block_children?.push(newBlock);
        // tmp
        storeBookmarkStructure();
        //
        return;
      }
    } else {
      return;
    }
    return;
  }
}

function updateBlock(
  pos: number[],
  target: string,
  payload: string | undefined
) {
  const result = search(pos);
  if (result.isFailed) {
    return;
  }
  if (typeof result.foundBlock === "object") {
    switch (target) {
      case "name":
        if (payload !== undefined) {
          result.foundBlock.block_name = payload;
        }
      case "url":
        result.foundBlock.block_url = payload;
    }
    // tmp
    storeBookmarkStructure();
    //
    return;
  }
  return;
}

function deleteBlock(pos: number[]) {
  if (pos.length > 1) {
    const lastNum: number = pos[pos.length - 1];
    pos.pop();
    const parentPos = pos;
    const result = search(parentPos);
    if (result.isFailed) {
      return;
    }
    pos.push(lastNum);
    if (result.foundBlock !== undefined) {
      result.foundBlock.block_children =
        result.foundBlock.block_children?.filter(
          (block) => !compareList(block.block_pos, pos)
        );
      // tmp
      storeBookmarkStructure();
      //
      return;
    }
    return;
  } else {
    structure = structure.filter((block) => !compareList(block.block_pos, pos));
    // tmp
    storeBookmarkStructure();
    //
    return;
  }
}

const structureFunctions = {
  getStructure: getStructure,
  addBlock: addBlock,
  deleteBlock: deleteBlock,
  updateBlock: updateBlock,
};

export default structureFunctions;
