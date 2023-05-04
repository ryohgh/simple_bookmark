import { Box, Button,  Modal, Stack, TextField, ThemeProvider } from "@mui/material";
import { useState } from "react";
import theme from "../themes/themes";
import muiTheme from "../themes/muiTheme";
import { structureFunctions } from "../functions";

interface Props {
    pos: number[];
    // eslint-disable-next-line @typescript-eslint/ban-types
    updateHierarchy: Function;
    // eslint-disable-next-line @typescript-eslint/ban-types
    setUpdatingState: Function;
    updatingState: boolean;
    type: string;
    currentName: string;
    currentUrl: string | undefined;
}

export default function EditMordal({ updateHierarchy, updatingState, setUpdatingState, pos, type, currentName, currentUrl }: Props): JSX.Element {
    const MORDAL = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "30%",
        backgroundColor: theme.bg_alt,
        border: '1px solid ' + theme.gray,
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
        outline: "none",
        display: "inline_grid",
    };
    const [updatingName, setUpdatingName] = useState<string>(currentName);
    const [updatingUrl, setUpdatingUrl] = useState<string | undefined>(currentUrl);

    function updateBlock() {
        if (type === "folder") {
            if (updatingName === "") {
                setUpdatingName(currentName);
            }
            structureFunctions.updateBlock(pos, type, updatingName);
            updateHierarchy();
            return
        }
        if (type === "bookmark") {
            if (updatingName === "") {
                setUpdatingName(currentName);
            }
            if (updatingUrl === "") {
                setUpdatingUrl(currentUrl);
            }
            structureFunctions.updateBlock(pos, "name", updatingName);
            structureFunctions.updateBlock(pos, "url", updatingUrl);
            updateHierarchy();
            setUpdatingState(false);
            return
        }
        return
    }

    return (
        <>
            <ThemeProvider theme={muiTheme}>
                <Modal
                    open={updatingState}
                    onClose={() => setUpdatingState(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box
                        justifyContent="flex-start"
                        sx={MORDAL}>
                        <Stack spacing={2}>
                            <TextField
                                onChange={e => setUpdatingName(e.target.value)}
                                id="outlined-basic"
                                label="name"
                                variant="outlined" />
                            {type === "bookmark" &&
                                <TextField
                                    onChange={e => setUpdatingUrl(e.target.value)}
                                    id="outlined-basic"
                                    label="url"
                                    variant="outlined" />
                            }
                            <Box
                                display="flex"
                                justifyContent="flex-end"
                                alignItems="flex-end"
                                sx={{
                                }}>
                                <Button
                                    sx={{ marginRight: "2%" }}
                                    onClick={() => setUpdatingState(false)}
                                    variant="outlined">cancel</Button>
                                <Button
                                    onClick={() => updateBlock()}
                                    variant="contained">update</Button>
                            </Box>
                        </Stack>
                    </Box>
                </Modal>

            </ThemeProvider>
        </>
    );
}