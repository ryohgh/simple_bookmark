import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { css } from "@emotion/css";
import Line from "./Line";
import { BlockFunctions } from "../interfaces";
import { useState } from "react";

function Bookmark({ theme, height, pos, url, name, blockFunctions }: {
    theme: {
        bg: string,
        bg_alt: string,
        fg: string,
        fg_alt: string,
        red: string,
        accent: string,
        gray: string
    },
    height: number,
    pos: number[],
    url: string | undefined,
    name: string,
    blockFunctions: BlockFunctions,
}): JSX.Element {
    const depth = pos.length;
    const ENTIRE_CSS = css`
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

    const BOOK_ICON_CSS = css`
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
        &:hover {
            cursor: pointer;
            color: ${theme.accent};
        }
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

    const URL_INPUT_CSS = css`
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
        left: calc(40% - ${(height * 5 - 10).toString() + "px"});
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
        transform: translate(0,-50%);
        left: calc(80% - ${(height + 30 + depth * 20 + height * 10 - 20).toString() + "px"});
        &:hover {
            background: ${theme.accent};
            color: ${theme.fg};
        }
        &:active {
            font-size: small;
        }
    `;

    function openUrl(): void {
        window.open(url, "_blank");
        return
    }

    const [newName, setNewName] = useState(name);
    const [newUrl, setNewUrl] = useState(url);

    function update(): void {
        const editFunction = blockFunctions.edit;
        editFunction(pos, "name", newName);
        editFunction(pos, "url", newUrl);
        setEditModeState(false);
        return
    }

    function deleteSelf(): void {
        const deleteFunction = blockFunctions.delete;
        deleteFunction(pos);
        return
    }

    const [editModeState, setEditModeState] = useState(false);
    return (<>
        <div className={ENTIRE_CSS}>
            <FontAwesomeIcon icon={faBook} className={BOOK_ICON_CSS} />
            <p
                className={NAME_CSS}
                onClick={() => openUrl()}
            >{name}</p>
            <FontAwesomeIcon icon={faEdit} className={EDIT_ICON_CSS} onClick={() => setEditModeState(!editModeState)} />
            <FontAwesomeIcon icon={faTrash} className={TRASH_ICON_CSS} onClick={deleteSelf} />
            {editModeState &&
                <>
                    <input
                        type="text"
                        className={NAME_INPUT_CSS}
                        onChange={e => setNewName(e.target.value)}
                        placeholder={"current name: " + name}
                    />
                    <input
                        type="text"
                        className={URL_INPUT_CSS} onChange={e => setNewUrl(e.target.value)}
                        placeholder={"current url: " + url}
                    />
                    <p className={UPDATE_BUTTON_CSS} onClick={update}>
                        update
                    </p>
                </>
            }
        </div>
        <Line
            theme={theme}
            width="100%"
        />
    </>);
}

export default Bookmark;