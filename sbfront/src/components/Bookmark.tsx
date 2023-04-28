import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { css } from "@emotion/css";

function Bookmark({ theme, height, depth, url, name }: {
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
    depth: number,
    url: string,
    name: string
}): JSX.Element {

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
        top: 50%;
        left: ${(height + 30 + depth * 20).toString() + "px"};
        transform: translate(0,-125%);
        &:hover {
            cursor: pointer;
            color: ${theme.accent};
        }
    `;

    function openUrl(): void {
        window.open(url, "_blank");
        return
    }

    return (<>
        <div className={ENTIRE_CSS}>
            <FontAwesomeIcon icon={faBook} className={BOOK_ICON_CSS} />
            <p
                className={NAME_CSS}
                style={{ fontFamily: "Jetbrains Mono,monospace" }}
                onClick={() => openUrl()}
            >{name}</p>
        </div>
    </>);
}

export default Bookmark;