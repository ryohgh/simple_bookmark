import { css } from "@emotion/css";

function Line({ theme, width }: {
    theme: {
        bg: string,
        bg_alt: string,
        fg: string,
        fg_alt: string,
        red: string,
        accent: string,
        gray: string,
    },
    width: string,
}): JSX.Element {
    return (<>
        <div className={css`
            background-color: ${theme.gray};
            width: ${width};
            height: 1px; 
        `}></div>
    </>);
}

export default Line;