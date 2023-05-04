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

    return (<>
        {toElement(structureFunctions.getStructure())}
    </>);
}