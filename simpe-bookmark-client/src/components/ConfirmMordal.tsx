import { Box, Button, Modal, ThemeProvider, Typography } from "@mui/material";
import theme from "../themes/themes";
import { useState } from "react";
import { appWindow } from "@tauri-apps/api/window";
import muiTheme from "../themes/muiTheme";
import { structureFunctions } from "../functions";

export default function ConfirmMordal() {
    const [confirmState, setConfirmState] = useState(false);
    appWindow.listen("tauri://close-requested", () => {
        setConfirmState(true);
    });

    function close() {
        appWindow.close();
    }

    function save() {
        structureFunctions.saveStructure().then(() => {
            // close();
        }).catch(err => {
            // error handling
            
        });
    }

    return (<>
        <ThemeProvider
            theme={muiTheme}>
            <Modal
                open={confirmState}
                onClose={() => setConfirmState(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: theme.bg_alt,
                    border: 1,
                    borderRadius: 2,
                    borderColor: theme.gray,
                    borderType: "solid",
                    color: theme.fg_alt,
                    boxShadow: 24,
                    p: 4,
                    outline: "none",
                }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Save changes
                    </Typography>
                    <Box
                        display="flex"
                        justifyContent="flex-end"
                        alignItems="flex-end">
                        <Button
                            onClick={close}
                            sx={{
                                marginRight: "2%",
                            }}
                            variant="outlined">not save</Button>
                        <Button
                            onClick={save}
                            variant="contained">save</Button>
                    </Box>
                </Box>
            </Modal >
        </ThemeProvider>
    </>);
}