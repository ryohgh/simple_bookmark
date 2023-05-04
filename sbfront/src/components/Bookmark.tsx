import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import BookIcon from '@mui/icons-material/Book';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { structureFunctions } from "../functions";
import theme from "../themes/themes";
import { UpdatingMordal } from "../components";

interface Props {
    height: number,
    pos: number[],
    url: string | undefined,
    name: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    updateHierarchy: Function,
}

function Bookmark({ height, pos, url, name, updateHierarchy }: Props) {
    const depth = pos.length - 1;
    function openUrl(): void {
        window.open(url, "_blank");
        return
    }

    function deleteSelf(): void {
        structureFunctions.deleteBlock(pos);
        updateHierarchy();
        return
    }

    const [deletionState, setDeletionState] = useState<boolean>(false);
    const [updatingState, setUpdatingState] = useState(false);
    const FUNCTION_SX = {
        color: theme.fg_alt,
        marginRight: "2%",
        "&:hover": {
            cursor: "pointer",
            color: theme.accent,
        }
    }

    return (<>
        <Box
            display="inline-flex">
            <Box
                alignItems="center"
                display="inline-flex"
                sx={{
                    marginTop: "5px",
                    height: height,
                    width: "80%",
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                    backgroundColor: theme.bg_alt,
                    "&:hover": {
                        cursor: "pointer",
                    }
                }}>
                <BookIcon
                    sx={{
                        color: theme.fg,
                        marginLeft: depth * 5,
                    }}></BookIcon>
                <Typography
                    onClick={openUrl}
                    sx={{
                        color: theme.fg,
                        marginLeft: "1%",
                        "&:hover": {
                            color: theme.accent,
                        }
                    }}
                    variant="h6">
                    {name}
                </Typography>
            </Box>
            <Box
                display="inline-flex"
                alignItems="center"
                justifyContent="flex-end"
                sx={{
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5,
                    width: "20%",
                    marginTop: "5px",
                    height: height,
                    backgroundColor: theme.bg_alt,
                }}>

                <EditIcon
                    onClick={() => setUpdatingState(true)}
                    sx={FUNCTION_SX}></EditIcon>
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
        <UpdatingMordal
            type="bookmark"
            currentName={name}
            currentUrl={url}
            pos={pos}
            setUpdatingState={setUpdatingState}
            updatingState={updatingState}
            updateHierarchy={updateHierarchy} />
    </>);
}

export default Bookmark;