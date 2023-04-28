import { themes } from "./themes.json"
const theme = themes.gruvbox;

import { Bookmark, Folder } from "./components";
import React, { Children } from "react";

window.document.body.style.backgroundColor = theme.bg;

const OBJECT_HEIGHT = 24;

interface FolderOrBookmark {
  type: string;
  name: string;
  depth: number;
  children: FolderOrBookmark[];
  url: string;
}

function toElement(structure: FolderOrBookmark[]): JSX.Element {

  function toFolder(children: JSX.Element[], depth: number, name: string): JSX.Element {
    return (<>
      <Folder
        theme={theme}
        height={OBJECT_HEIGHT}
        children={children}
        depth={depth}
        name={name}
      />
    </>);
  }

  function toBookmark(depth: number, name: string, url: string): JSX.Element {
    return (<>
      <Bookmark
        theme={theme}
        height={OBJECT_HEIGHT}
        depth={depth}
        name={name}
        url={url}
      />
    </>);
  }

  let depth = 1;

  function tmp(children: FolderOrBookmark[]): JSX.Element[] {
    depth += 1;
    const values = Object.values(children);
    const elements: JSX.Element[] = [];
    for (const value of values) {
      if (value.type === "folder") {
        const next_children = tmp(value.children);
        const folder = toFolder(next_children, depth, value.name);
        elements.push(folder);
      }
      if (value.type === "bookmark") {
        const bookmark = toBookmark(value.depth, value.name, value.url);
        elements.push(bookmark);
      }
    }
    return elements;
  }

  const values = Object.values(structure);
  const elements: JSX.Element[] = [<></>];
  for (const value of values) {
    if (value.type === "folder") {
      depth = 1
      const next_children = tmp(value.children);
      const folder = toFolder(next_children, depth, value.name);
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

const test_object = [
  {
    type: "folder",
    name: "folder1",
    depth: 1,
    children: {
      j1: {
        type: "bookmark",
        name: "arch user repository",
        url: "https://aur.archlinux.org/",
        depth: 2,
      },
      j2: {
        type: "folder",
        name: "folder2",
        depth: 2,
        children: {
          k1: {
            type: "bookmark",
            name: "github",
            url: "https://github.com/",
            depth: 3,
          }
        },
      }
    }
  },
  {
    type: "bookmark",
    name: "youtube",
    url: "https://youtube.com/",
    depth: 1,
  }
];

function App(): JSX.Element {
  return (<>
    {toElement(test_object)}
  </>);
}

export default App
