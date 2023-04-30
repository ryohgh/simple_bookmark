import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faPlus, faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { css } from "@emotion/css"
import React, { useState } from "react";
import { Line } from "../components";
import { BlockFunctions } from "../interfaces";

function Folder({ theme, name, height, children, pos, blockFunctions }: {
    theme: {
        bg: string,
        bg_alt: string,
        fg: string,
        fg_alt: string,
        red: string,
        accent: string,
        gray: string
    },
    name: string,
    height: number,
    children: JSX.Element[],
    pos: number[],
    blockFunctions: BlockFunctions,
}): JSX.Element {
    const depth = pos.length;
    const OUTER_CSS = css`
        color: ${theme.fg};
        height: ${height.toString() + "px"};
        width: 100%;
        background-color: ${theme.bg_alt};
        position: relative;
        &:hover {
            background-color: ${theme.gray};
            cursor: pointer;
        }
    `;
    const INNER_CSS = css`
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
    `;
    const FOLDER_ICON_CSS = css`
        color: ${theme.fg}; 
        position: absolute;
        top: 50%;
        left: ${(height + depth * 20).toString() + "px"};
        transform: translate(0,-50%);

    `;
    const NAME_CSS = css`
        color: ${theme.fg}; 
        position: absolute;
        left: ${(height + 30 + depth * 20).toString() + "px"};
    `;
    const TRASH_ICON_CSS = css`
        color: ${theme.fg}; 
        position: absolute;
        top: 50%;
        right: ${(height).toString() + "px"};
        transform: translate(0,-50%);
        &:hover {
            color: ${theme.accent};
        }
    `;
    const EDIT_ICON_CSS = css`
        color: ${theme.fg}; 
        position: absolute;
        top: 50%;
        right: ${(height * 4).toString() + "px"};
        transform: translate(0,-50%);
        &:hover {
            color: ${theme.accent};
        }
    `;
    const ADD_ICON_CSS = css`
        color: ${theme.fg}; 
        position: absolute;
        top: 50%;
        right: ${(height * 3).toString() + "px"};
        transform: translate(0,-50%);
        &:hover {
            color: ${theme.accent};
        }
        `;

    const NAME_INPUT_CSS = css`
        background-color: ${theme.bg};
        border-top: 0px;
        border-left: 0px;
        border-right: 0px;
        border-bottom: 0px solid ${theme.accent};
        border-radius: 3px;
        position: absolute;
        top: 50%;
        transform: translate(0,-50%);
        color: ${theme.fg};
        width: calc(40% - ${(height + 30 + depth * 20 + height * 5).toString() + "px"});
        left: ${(height + 30 + depth * 20).toString() + "px"};
        &:focus {
            outline: none;
            border: 0.5px solid ${theme.accent};
        }
        &::placeholder {
            position: absolute;
            font-size: medium;
        }
    `;

    const UPDATE_BUTTON_CSS = css`
        background-color: ${theme.bg};
        color: ${theme.accent};
        border: 0.1px solid ${theme.accent};
        border-radius: 3px;
        font-size: smaller;
        padding-left: 5px;
        padding-right: 5px;
        position: absolute;
        top: 50%;
        left: calc(40% - ${(height * 5 - 10).toString() + "px"});
        transform: translate(0,-50%);
        &:hover {
            background: ${theme.accent};
            color: ${theme.fg};
        }
        &:active {
            font-size: small;
        }
    `;

    const [newName, setNewName] = useState(name);

    function update(): void {
        const editFunction = blockFunctions.edit;
        editFunction(pos, "name", newName);
        setEditModeState(false);
        return
    }
    
    function deleteSelf() :void {
        const deleteFunction = blockFunctions.delete;
        deleteFunction(pos);
        return
    }

    const [editModeState, setEditModeState] = useState(false);
    const [isChildrenOpened, setChildrenState] = useState(false);
    return (
        <>
            <div className={OUTER_CSS}>
                <div className={INNER_CSS} onClick={() => { setChildrenState(!isChildrenOpened) }}>
                    <FontAwesomeIcon icon={faFolder} className={FOLDER_ICON_CSS} />
                    <p
                        className={NAME_CSS}
                    >{name}</p>

                </div>
                {editModeState && <>
                    <input
                        type="text"
                        className={NAME_INPUT_CSS}
                        onChange={e => setNewName(e.target.value)}
                        placeholder={"current name: " + name}
                    />
                    <p className={UPDATE_BUTTON_CSS} onClick={update}>
                        update
                    </p>
                </>
                }
                <FontAwesomeIcon icon={faTrash} className={TRASH_ICON_CSS} onClick={deleteSelf}/>
                <FontAwesomeIcon icon={faPenToSquare} className={EDIT_ICON_CSS} onClick={() => setEditModeState(!editModeState)} />
                <FontAwesomeIcon icon={faPlus} className={ADD_ICON_CSS} />
            </div>
            <Line
                theme={theme}
                width="100%"
            />
            {isChildrenOpened &&
                <>
                    {React.Children.toArray(children.map((child) => {
                        return (<>
                            {child}
                        </>);
                    }))}
                </>
            }
        </>
    );
}

export default Folder;