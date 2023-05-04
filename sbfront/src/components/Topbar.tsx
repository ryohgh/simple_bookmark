import theme from "../themes/themes";
import muiTheme from "../themes/muiTheme";
import { Box, Button, ThemeProvider, Typography } from "@mui/material";
import { useState } from "react";
import AddingMordal from "./AddingMordal";

interface Props {
    height: number;
    // eslint-disable-next-line @typescript-eslint/ban-types
    update: Function;
}

export default function Topbar({ height ,update}: Props): JSX.Element {
    const [addingState, setAddingState] = useState<boolean>(false);
    return (<>
        <ThemeProvider theme={muiTheme}>
            <Box
                display="inline-flex"
                sx={{
                    height: height,
                    width: "100%",
                }}>
                <Box
                    sx={{
                        width: "50%",
                        height: height,
                        backgroundColor: theme.bg
                    }}>
                    <Typography
                        sx={{
                            color: theme.fg_alt,
                        }}
                        variant="h5">
                        Simple Bookmarker
                    </Typography>
                </Box>
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                    sx={{
                        width: "50%",
                        height: height,
                        backgroundColor: theme.bg,
                    }}>
                    <Button
                        onClick={() => setAddingState(true)}
                        variant="contained">add</Button>
                </Box>
            </Box>
        </ThemeProvider>
        <AddingMordal
            addingState={addingState}
            setAddingState={setAddingState}
            updateHierarchy={update}
            pos={[0]}
        />
    </>);
}