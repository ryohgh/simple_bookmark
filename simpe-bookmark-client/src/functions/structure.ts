import { BookmarkBlock } from "../interfaces";
import compareList from "./compareList";
import { invoke } from "@tauri-apps/api/tauri";

let structure: BookmarkBlock[] = [];
let state: boolean = true;

function getStructure(): BookmarkBlock[] {
  return structure;
}

function setState(nextState: boolean) {
  state = nextState;
  return;
}

// function triggers storing bookmark information to the json file.
async function saveStructure() {
  const structure = {
    bookmark_structure: getStructure(),
  };
  const bookmarkStructureJson = JSON.stringify(structure);
  await invoke("save_structure", { bookmarkStructureJson })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
}

async function fetchStructure() {
  if (state) {
    setState(false);
    await invoke("fetch_structure")
      .then((res) => {
        const res_string = res as string;
        const fetched_structure: BookmarkBlock[] = JSON.parse(res_string);
        console.log(fetched_structure);
        if (fetched_structure === undefined) {
          setState(true);
          return;
        } else {
          structure = fetched_structure;
          setState(true);
          return;
        }
      })
      .catch((err) => {
        setState(false);
        throw err;
      });
  }
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
  if (state) {
    setState(false);
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
      setState(true);
      return;
    } else {
      const result = search(pos);
      if (result.isFailed) {
        setState(true);
        return;
      }
      const currentFolder = result.foundBlock;
      if (currentFolder?.block_type === "folder") {
        if (currentFolder.block_children !== undefined) {
          const lastChild =
            currentFolder.block_children[
              currentFolder.block_children.length - 1
            ];
          let lastChildId: number;
          if (lastChild === undefined) {
            lastChildId = 1;
          } else {
            lastChildId =
              lastChild.block_pos[lastChild.block_pos.length - 1] + 1;
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
          setState(true);
          return;
        }
      } else {
        setState(true);
        return;
      }
      setState(true);
      return;
    }
  }
}

function updateBlock(
  pos: number[],
  target: string,
  payload: string | undefined
) {
  if (state) {
    setState(false);
    const result = search(pos);
    if (result.isFailed) {
      setState(true);
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
      setState(true);
      return;
    }
    setState(true);
    return;
  }
}

function deleteBlock(pos: number[]) {
  if (state) {
    setState(false);
    if (pos.length > 1) {
      const lastNum: number = pos[pos.length - 1];
      pos.pop();
      const parentPos = pos;
      const result = search(parentPos);
      if (result.isFailed) {
        setState(true);
        return;
      }
      pos.push(lastNum);
      if (result.foundBlock !== undefined) {
        result.foundBlock.block_children =
          result.foundBlock.block_children?.filter(
            (block) => !compareList(block.block_pos, pos)
          );
        setState(true);
        return;
      }
      setState(true);
      return;
    } else {
      structure = structure.filter(
        (block) => !compareList(block.block_pos, pos)
      );
      setState(true);
      return;
    }
  }
}

const structureFunctions = {
  fetchStructure: fetchStructure,
  getStructure: getStructure,
  saveStructure: saveStructure,
  addBlock: addBlock,
  deleteBlock: deleteBlock,
  updateBlock: updateBlock,
};

export default structureFunctions;
