import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { css } from "@emotion/css"
import React, { useState } from "react";
import { Line } from "../components";

function Folder({ theme, name, height, children, depth }: {
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
    depth: number,
}): JSX.Element {

    const ENTIRE_CSS = css`
        color: ${theme.fg};
        height: ${height.toString() + "px"};
        width: 100%;
        background-color: ${theme.bg_alt};
        position: relative;
        // top: ${(height).toString() + "px"};
        &:hover {
            background-color: ${theme.gray};
            cursor: pointer;
        }
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
        top: 50%;
        left: ${(height + 30 + depth * 20).toString() + "px"};
transform: translate(0,-125%);
    `;

    const [isOpened, setState] = useState(false);

    return (
        <>
            <div className={ENTIRE_CSS} onClick={() => { setState(!isOpened) }}>
                <FontAwesomeIcon icon={faFolder} className={FOLDER_ICON_CSS} />
                <p style={{ fontFamily: "Jetbrains Mono,monospace" }} className={NAME_CSS}>{name}</p>
            </div>
            <Line
                theme={theme}
                width="100%"
            />
            {isOpened &&
                <>
                    {React.Children.toArray(children.map((element) => {
                        return (<>
                            {element}
                        </>);
                    }))}
                </>
            }
        </>
    );
}

export default Folder;