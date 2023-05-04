import React, { useState } from "react";
import { Box, Button, ThemeProvider, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { structureFunctions } from "../functions";
import { AddingMordal, UpdatingMordal } from "../components";
import theme from "../themes/themes";
import muiTheme from "../themes/muiTheme";

interface Props {
    name: string;
    height: number;
    children: JSX.Element[];
    pos: number[];
    // eslint-disable-next-line @typescript-eslint/ban-types
    updateHierarchy: Function;
}

function Folder({ name, height, children, pos, updateHierarchy }: Props): JSX.Element {
    const depth = pos.length - 1;
    const [addingState, setAddingState] = useState<boolean>(false);
    const [deletionState, setDeletionState] = useState<boolean>(false);
    const [updatingState, setUpdatingState] = useState<boolean>(false);
    const [childrenState, setChildrenState] = useState<boolean>(false);


    function deleteSelf(): void {
        structureFunctions.deleteBlock(pos);
        updateHierarchy();
        return
    }

    const ARROW_SX = {
        color: theme.fg,
        marginLeft: depth * 5,
        "&:hover": {
            cursor: "pointer",
        }
    };
    const FOLDER_SX = {
        color: theme.fg,
        marginLeft: "2%",
        "&:hover": {
            cursor: "pointer",
            color: theme.accent,
        }
    };
    const FUNCTION_SX = {
        color: theme.fg_alt,
        marginRight: "2%",
        "&:hover": {
            cursor: "pointer",
            color: theme.accent,
        }
    }

    function Arrow(): JSX.Element {
        if (childrenState) {
            return <KeyboardArrowDownIcon
                fontSize="large"
                onClick={() => setChildrenState(false)}
                sx={ARROW_SX}></KeyboardArrowDownIcon>;
        } else {
            return <KeyboardArrowRightIcon
                fontSize="large"
                onClick={() => setChildrenState(true)}
                sx={ARROW_SX}></KeyboardArrowRightIcon>
        }
    }

    return (
        <>
            <ThemeProvider theme={muiTheme}>
                <Box
                    sx={{
                        width: "100%",
                        display: "inline-grid",
                    }}>
                    <Box
                        display="inline-flex">
                        <Box
                            alignItems="center"
                            display="inline-flex"
                            sx={{
                                marginTop: "5px",
                                borderTopLeftRadius: 5,
                                borderBottomLeftRadius: 5,
                                width: "80%",
                                height: height,
                                backgroundColor: theme.bg_alt,
                            }}>
                            {Arrow()}
                            <FolderIcon
                                onClick={() => setChildrenState(!childrenState)}
                                sx={FOLDER_SX}></FolderIcon>
                            <Typography
                                onClick={() => setChildrenState(!childrenState)}
                                sx={FOLDER_SX}
                                variant="h6">
                                {name}
                            </Typography>
                        </Box>
                        <Box
                            alignItems="center"
                            justifyContent="flex-end"
                            display="inline-flex"
                            sx={{
                                borderTopRightRadius: 5,
                                borderBottomRightRadius: 5,
                                width: "20%",
                                marginTop: "5px",
                                height: height,
                                backgroundColor: theme.bg_alt,
                            }}>
                            <AddIcon
                                onClick={() => setAddingState(true)}
                                fontSize="large"
                                sx={FUNCTION_SX}></AddIcon>
                            <EditIcon sx={FUNCTION_SX}></EditIcon>
                            {deletionState && <>
                                <Button
                                    sx={{
                                        marginRight: "2%",
                                    }}
                                    color="error"
                                    onClick={deleteSelf}
                                    size="small"
                                    variant="outlined">delete</Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => setDeletionState(false)}
                                    sx={{
                                        marginRight: "2%",
                                    }}
                                >cancel</Button>
                            </>}
                            <DeleteIcon
                                onClick={() => setDeletionState(true)}
                                sx={FUNCTION_SX}></DeleteIcon>

                        </Box>
                    </Box>
                    {childrenState &&
                        <>
                            {React.Children.toArray(children.map((child) => {
                                return (<>
                                    {child}
                                </>);
                            }))}
                        </>
                    }
                </Box>
                <AddingMordal
                    updateHierarchy={updateHierarchy}
                    addingState={addingState}
                    setAddingState={setAddingState}
                    pos={pos}
                />
                <UpdatingMordal
                    updateHierarchy={updateHierarchy}
                    updatingState={updatingState}
                    setUpdatingState={setUpdatingState}
                    pos={pos}
                    currentName={name}
                    currentUrl={undefined}
                    type="folder" />
            </ThemeProvider>
        </>
    );
}
export default Folder;
