import { css } from "@emotion/css";
import theme from "../themes/themes";

function Line({ width }: {
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