import { Folder, Bookmark } from "../components";
import { BookmarkBlock } from "../interfaces";
import React, { useState } from "react";
import { structureFunctions } from "../functions";

interface Props {
    height: number;
}

export default function Hierarchy({ height }: Props): JSX.Element {

    const [, forceUpdate] = useState<number>(0);

    function updateHierarchy() {
        forceUpdate(prevState => prevState + 1);
        return
    }

    function toElement(structure: BookmarkBlock[]): JSX.Element {
        function toFolder(children: JSX.Element[], pos: number[], name: string): JSX.Element {
            return (<>
                <Folder
                    height={height}
                    children={children}
                    pos={pos}
                    name={name}
                    updateHierarchy={updateHierarchy}
                />
            </>);
        }

        function toBookmark(pos: number[], name: string, url: string | undefined): JSX.Element {
            return (<>
                <Bookmark
                    height={height}
                    pos={pos}
                    name={name}
                    url={url}
                    updateHierarchy={updateHierarchy}
                />
            </>);
        }

        function genChildren(children: BookmarkBlock[] | undefined): JSX.Element[] {
            const elements: JSX.Element[] = [];
            if (children !== undefined) {
                const values = Object.values(children);
                for (const value of values) {
                    if (value.block_type === "folder") {
                        const next_children = genChildren(value.block_children);
                        const folder = toFolder(next_children, value.block_pos, value.block_name);
                        elements.push(folder);
                    }
                    if (value.block_type === "bookmark") {
                        const bookmark = toBookmark(value.block_pos, value.block_name, value.block_url);
                        elements.push(bookmark);
                    }
                }
            }
            return elements;
        }

        const values = Object.values(structure);
        const elements: JSX.Element[] = [];
        for (const value of values) {
            if (value.block_type === "folder") {
                const newChildren = genChildren(value.block_children);
                const folder = toFolder(newChildren, value.block_pos, value.block_name);
                elements.push(folder);
            }
            if (value.block_type === "bookmark") {
                const newBookmark = toBookmark(value.block_pos, value.block_name, value.block_url);
                elements.push(newBookmark);
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

    return (<>
        {toElement(structureFunctions.getStructure())}
    </>);
}