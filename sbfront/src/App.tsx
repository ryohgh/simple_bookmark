import { themes } from "./themes.json"
import { Bookmark, Folder } from "./components";
import React, { useState } from "react";
import { BookmarkBlock, BlockFunctions } from "./interfaces";
import { values } from "lodash";

const theme = themes.gruvbox;
window.document.body.style.backgroundColor = theme.bg;
const OBJECT_HEIGHT = 24;

function compareList(list1: any[], list2: any[]): boolean {
  const result = list1.length === list2.length && list1.every((value, index) => value === list2[index]);
  return result;
}

function search(pos: number[], structure: BookmarkBlock[],): {
  foundBlock: BookmarkBlock | undefined,
  isFailed: boolean,
} {
  let children: BookmarkBlock[] | undefined = structure;
  for (let i = 1; i <= pos.length; i++) {
    const result = searchEachLayer(children, pos.slice(0, i))
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
    children = result.children
  }
  return {
    foundBlock: undefined,
    isFailed: true,
  };

  function searchEachLayer(children: BookmarkBlock[] | undefined, parentPos: number[]): {
    isFailed: boolean,
    isFound: boolean,
    children: BookmarkBlock[] | undefined,
    foundBlock: BookmarkBlock | undefined,
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
            }
          }
          return {
            isFailed: false,
            isFound: false,
            foundBlock: undefined,
            children: value.children,
          }
        }
      }
      return {
        isFailed: true,
        isFound: false,
        foundBlock: undefined,
        children: undefined,
      }
    }
    return {
      isFailed: true,
      isFound: false,
      foundBlock: undefined,
      children: undefined,
    };
  }
}

const bookmarkStructure: BookmarkBlock[] = [
  {
    type: "folder",
    name: "folder1",
    pos: [1],
    url: "",
    children: [
      {
        type: "bookmark",
        name: "arch user repository",
        url: "https://aur.archlinux.org/",
        pos: [1, 1],
        children: [],
      },
      {
        type: "folder",
        name: "folder2",
        pos: [1, 2],
        url: "a",
        children: [
          {
            type: "bookmark",
            name: "github",
            url: "https://github.com/",
            pos: [1, 2, 3],
            children: []
          }
        ],
      }
    ]
  },
  {
    type: "bookmark",
    name: "youtube",
    url: "https://youtube.com/",
    pos: [2],
    children: []
  }
];

function App(): JSX.Element {

  function toElement(structure: BookmarkBlock[]): JSX.Element {
    function toFolder(children: JSX.Element[], pos: number[], name: string): JSX.Element {
      return (<>
        <Folder
          theme={theme}
          height={OBJECT_HEIGHT}
          children={children}
          pos={pos}
          name={name}
          blockFunctions={blockFunctions}
        />
      </>);
    }

    function toBookmark(pos: number[], name: string, url: string | undefined): JSX.Element {
      return (<>
        <Bookmark
          theme={theme}
          height={OBJECT_HEIGHT}
          pos={pos}
          name={name}
          url={url}
          blockFunctions={blockFunctions}
        />
      </>);
    }

    function genChildren(children: BookmarkBlock[] | undefined): JSX.Element[] {
      const elements: JSX.Element[] = [];
      if (children !== undefined) {
        const values = Object.values(children);
        for (const value of values) {
          if (value.type === "folder") {
            const next_children = genChildren(value.children);
            const folder = toFolder(next_children, value.pos, value.name);
            elements.push(folder);
          }
          if (value.type === "bookmark") {
            const bookmark = toBookmark(value.pos, value.name, value.url);
            elements.push(bookmark);
          }
        }
      }
      return elements;
    }

    const values = Object.values(structure);
    const elements: JSX.Element[] = [<></>];
    for (const value of values) {
      if (value.type === "folder") {
        const next_children = genChildren(value.children);
        const folder = toFolder(next_children, value.pos, value.name);
        elements.push(folder);
      } else {
        continue;
      }
    }
    return (<>
      {React.Children.toArray(elements.map((element) => {
        return (<>
          {element}
        </>);
      }))}
    </>);
  }

  const blockFunctions: BlockFunctions = {
    edit: editBlock,
    add: addBlock,
    delete: deleteBlock,
  }

  function addBlock() {
    return
  }

  function deleteBlock(pos: number[]) {
    const lastPos = pos[pos.length - 1];
    pos.pop();
    const parentPos = pos;
    const result = search(parentPos, bookmarkStructure);
    if (result.isFailed) {
      return;
    }
    pos.push(lastPos)
    if (result.foundBlock !== undefined) {
      console.log(pos);
      result.foundBlock.children = result.foundBlock.children?.filter(block => !compareList(block.pos, pos));
      forceUpdate(prevState => prevState + 1);
    }
    return
  }

  const [, forceUpdate] = useState(0);

  function editBlock(pos: number[], target: string, payload: string) {
    console.log(pos);
    const result = search(pos, bookmarkStructure);
    if (result.isFailed) {
      return
    }
    if (typeof result.foundBlock === "object") {
      switch (target) {
        case "name":
          result.foundBlock.name = payload;
          forceUpdate(prevState => prevState + 1);
          return
        case "url":
          result.foundBlock.url = payload;
          return
      }
    }
    return
  }

  return (<>
    {toElement(bookmarkStructure)}
  </>);
}

export default App
