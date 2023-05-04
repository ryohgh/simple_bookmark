import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, Stack, TextField, ThemeProvider } from "@mui/material";
import { useState } from "react";
import theme from "../themes/themes";
import muiTheme from "../themes/muiTheme";
import { structureFunctions } from "../functions";

interface Props {
    addingState: boolean;
    pos: number[];
    // eslint-disable-next-line @typescript-eslint/ban-types
    updateHierarchy: Function;
    // eslint-disable-next-line @typescript-eslint/ban-types
    setAddingState: Function;
}

export default function AddingMordal({ updateHierarchy, addingState, setAddingState, pos }: Props): JSX.Element {
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
    const [addingType, setAddingType] = useState<string>("folder");
    const [addingName, setAddingName] = useState<string>("");
    const [addingUrl, setAddingUrl] = useState<string | undefined>(undefined);

    function addBlock(): void {
        console.log("here");
        structureFunctions.addBlock(pos, addingType, addingName, addingUrl)
        updateHierarchy();
        setAddingName("");
        setAddingUrl("");
        setAddingState(false);
        return
    }
    const handleChange = (event: SelectChangeEvent) => {
        setAddingType(event.target.value as string);
    };

    return (
        <>
            <ThemeProvider theme={muiTheme}>
                <Modal
                    open={addingState}
                    onClose={() => setAddingState(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box
                        justifyContent="flex-start"
                        sx={MORDAL}>
                        <Stack spacing={2}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={addingType}
                                    label="Age"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={"folder"}>Folder</MenuItem>
                                    <MenuItem value={"bookmark"}>Bookmark</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                onChange={e => setAddingName(e.target.value)}
                                id="outlined-basic"
                                label="Name"
                                variant="outlined" />
                            {addingType === "bookmark" &&
                                <TextField
                                    onChange={e => setAddingUrl(e.target.value)}
                                    id="outlined-basic"
                                    label="Url"
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
                                    onClick={() => setAddingState(false)}
                                    variant="outlined">cancel</Button>
                                <Button
                                    onClick={() => addBlock()}
                                    variant="contained">add</Button>
                            </Box>
                        </Stack>
                    </Box>
                </Modal>

            </ThemeProvider>
        </>
    );
}