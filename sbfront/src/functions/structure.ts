import { BookmarkBlock } from "../interfaces";
import compareList from "./compareList";

let structure: BookmarkBlock[] = [
  // {
  //   type: "folder",
  //   name: "folder1",
  //   pos: [1],
  //   url: "",
  //   children: [
  //     {
  //       type: "bookmark",
  //       name: "arch user repository",
  //       url: "https://aur.archlinux.org/",
  //       pos: [1, 1],
  //       children: [],
  //     },
  //     {
  //       type: "folder",
  //       name: "folder2",
  //       pos: [1, 2],
  //       url: "a",
  //       children: [
  //         {
  //           type: "bookmark",
  //           name: "github",
  //           url: "https://github.com/",
  //           pos: [1, 2, 3],
  //           children: [],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   type: "bookmark",
  //   name: "youtube",
  //   url: "https://youtube.com/",
  //   pos: [2],
  //   children: [],
  // },
];

function getStructure(): BookmarkBlock[] {
  return structure;
}

function updateStructure(newStructure: BookmarkBlock[]): void {
  structure = newStructure;
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
        if (compareList(value.pos, parentPos)) {
          if (compareList(value.pos, pos)) {
            return {
              isFailed: false,
              isFound: true,
              foundBlock: value,
              children: value.children,
            };
          }
          return {
            isFailed: false,
            isFound: false,
            foundBlock: undefined,
            children: value.children,
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
      lastId = structure[structure.length - 1].pos[0];
    } else {
      lastId = 1;
    }
    const newBlock: BookmarkBlock = {
      pos: [lastId + 1],
      type: type,
      name: name,
      url: url,
      children: [],
    };
    structure.push(newBlock);
    return;
  } else {
    const result = search(pos);
    if (result.isFailed) {
      return;
    }
    const currentFolder = result.foundBlock;
    if (currentFolder?.type === "folder") {
      if (currentFolder.children !== undefined) {
        const lastChild =
          currentFolder.children[currentFolder.children.length - 1];
        let lastChildId: number;
        if (lastChild === undefined) {
          lastChildId = 1;
        } else {
          lastChildId = lastChild.pos[lastChild.pos.length - 1] + 1;
        }
        const newPos: number[] = [];
        for (let i = 0; i < pos.length; i++) {
          newPos.push(pos[i]);
        }
        newPos.push(lastChildId);
        const newBlock: BookmarkBlock = {
          pos: newPos,
          type: type,
          name: name,
          url: url,
          children: [],
        };
        currentFolder.children?.push(newBlock);
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
  console.log("hewre");
  if (typeof result.foundBlock === "object") {
    switch (target) {
      case "name":
        if (payload !== undefined) {
          result.foundBlock.name = payload;
        }
        return;
      case "url":
        result.foundBlock.url = payload;
        return;
    }
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
      result.foundBlock.children = result.foundBlock.children?.filter(
        (block) => !compareList(block.pos, pos)
      );
      return;
    }
    return;
  } else {
    structure = structure.filter((block) => !compareList(block.pos, pos));
    return;
  }
}

const structureFunctions = {
  getStructure: getStructure,
  updateStructure: updateStructure,
  addBlock: addBlock,
  deleteBlock: deleteBlock,
  updateBlock: updateBlock,
};

export default structureFunctions;
