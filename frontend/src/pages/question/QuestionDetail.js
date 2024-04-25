/* eslint-disable */

import { useEffect, useCallback, useState, useReducer } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';

// @mui
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import { Container, Stack, Grid, Card, Typography, CardContent, Button, Slider, IconButton, Box, Dialog, DialogActions, DialogContent, CircularProgress, DialogContentText, DialogTitle, TextField } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

// components
import { UploadMultiFile } from '../../components/upload';
import SubmissionList from "./SubmissionList"
import UploadService from "./UploadService";
import axios from 'axios';



// ----------------------------------------------------------------------


export default function QuestionList() {

    const { cycleId, id } = useParams();
    const [question, setQuestion] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const navigate = useNavigate();

    const [files, setFiles] = useState([]);
    const [messages, setMessages] = useState([]);
    const [openSettings, setOpenSettings] = useState(false);
    const [open, setOpen] = useState(false);

    const [nameInput, setNameInput] = useState('');
    const [employeeInput, setEmployeeInput] = useState('');
    const [descriptionInput, setDescriptionInput] = useState('');

    const handleSettingsOpen = () => {
        setOpenSettings(true);
    };

    const handleSettingsClose = () => {
        setOpenSettings(false);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        window.location.reload();
    }

    const handleDelete = async () => {
        try {
            axios.patch(`http://127.0.0.1:5000/question_count_update/${cycleId}/delete`);
            axios.get(`https://t99hwkreli.execute-api.us-east-1.amazonaws.com/default/deleteQuestion/?question_hash=${id}&cycle_id=${cycleId}`)
            navigate(`${PATH_DASHBOARD.question.root}/${cycleId}/list`);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    const handleEdit = () => {
        const data = {
            'title': nameInput,
            'cs_hr': employeeInput,
            'question_description': descriptionInput
        }
        console.log(data)
        try {
            axios.post(`https://t99hwkreli.execute-api.us-east-1.amazonaws.com/default/editQuestion/?question_hash=${id}&cycle_id=${cycleId}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const initialize = async () => {
            try {
                await axios.get(`https://t99hwkreli.execute-api.us-east-1.amazonaws.com/default/getQuestionById/?question_hash=${id}&cycleId=${cycleId}`).then((res) => {
                    setQuestion(res.data)
                    setNameInput(res.data.title)
                    setEmployeeInput(res.data.cs_hr)
                    setDescriptionInput(res.data.question_description)
                });
            } catch (err) {
                console.log(err);
            }
        };
        initialize();
    }, [ignored]);


    const handleNameChange = event => {
        setNameInput(event.target.value)
    }
    const handleEmployeeChange = event => {
        setEmployeeInput(event.target.value)
    }
    const handleDescriptionChange = event => {
        setDescriptionInput(event.target.value)
    }

    const methods = useForm({
        files,
    });

    const {
        reset,
        setError,
        watch,
        setValue,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = methods;


    async function upload(idx, file) {

        await UploadService.upload(file, question.question_hash, question.question_type, (event) => {
        })
            .then((response) => {
                messages.push("Uploaded the file successfully: " + file.name);
                let nextMessage = [...messages];
                setMessages(nextMessage);
            })
            .catch(() => {
                messages.push("Could not upload the file: " + file.name);
                let nextMessage = [...messages];
                setMessages(nextMessage);
            });
    }

    const handleDropMultiFile = useCallback((acceptedFiles) => {
        const newFiles = acceptedFiles.map((file) => Object.assign(file, {
            preview: URL.createObjectURL(file),
        }));
        setFiles([...files, ...newFiles]);
    }, [files]);

    const handleRemoveFile = (inputFile) => {
        const filtered = files.filter((file) => file !== inputFile);
        setFiles(filtered);
    };
    const handleRemoveAllFiles = () => {
        setFiles([]);
    };

    const handleUpdate = () => {
        forceUpdate();
        setLoading(false)
    }

    const handleUpload = () => {

        setLoading(true);
        for (let i = 0; i < files.length; i += 1) {
            upload(i, files[i]);
        }
        handleOpen();
    };

    return (
        <Page title="Question" sx={{ height: 1 }}>
            <Container maxWidth={false} sx={{ height: 1 }}>
                <Stack direction="row"
                    justifyContent="space-between"
                    spacing={2}>
                    <HeaderBreadcrumbs
                        heading={`${question.title}`}
                        links={[
                            {
                                name: 'Dashboard',
                                href: PATH_DASHBOARD.root,
                            },
                            {
                                name: `${cycleId}`,
                                href: `${PATH_DASHBOARD.question.root}/${cycleId}/list`,
                            },
                            {
                                name: `${question.title}`
                            }
                        ]}
                    />
                    <Box>
                        <IconButton fullwidth="true" aria-label="settings-icon" color="secondary" onClick={handleSettingsOpen}>
                            <SettingsIcon />
                        </IconButton>
                        <Dialog
                            open={openSettings}
                            onClose={handleSettingsClose}
                            aria-labelledby="responsive-dialog-title"
                        >
                            <DialogTitle id="responsive-dialog-title">
                                {"Edit Question"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    You can change the question metadata here, or delete the question with the button below.
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Question Name"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={nameInput}
                                    onChange={handleNameChange}
                                />
                                <TextField
                                    margin="dense"
                                    id="employee"
                                    label="Question Owner"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={employeeInput}
                                    onChange={handleEmployeeChange}
                                />
                                <TextField
                                    margin="dense"
                                    id="description"
                                    label="Question Description"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={descriptionInput}
                                    onChange={handleDescriptionChange}
                                />
                            </DialogContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <DialogActions>
                                    <Button onClick={handleDelete} color="error" startIcon={<DeleteIcon />}>
                                        Delete Question
                                    </Button>
                                </DialogActions>
                                <DialogActions>
                                    <Button onClick={handleEdit} autoFocus>
                                        Update Question
                                    </Button>
                                </DialogActions>
                            </Stack>
                        </Dialog>
                    </Box>
                </Stack>
                <Dialog
                    open={open}
                    aria-labelledby="alert-dialog-title"
                    keepMounted
                    aria-describedby="alert-dialog-description"
                    maxWidth='lg'
                    fullWidth={true}
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Upload File Progress"}
                    </DialogTitle>
                    <DialogContent sx={{ p: 3, m: 2 }}>

                        <DialogContentText id="alert-dialog-description">
                            {files.map((file, index) => (
                                <Stack direction="row"
                                    spacing={2}><Typography>{file.name}</Typography>
                                    {messages[index] ? <Typography>{messages[index]}</Typography> : <CircularProgress />}</Stack>

                            ))}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} autoFocus>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ height: '40vh' }}>
                            <CardContent>
                            <Typography sx={{ fontSize: 25 }} color="text.primary" gutterBottom>
                                        {question.title}
                                    </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.primary">
                                    Owner: {question.cs_hr}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    File Type: {question.question_type}
                                </Typography>
                                <Typography variant="body2">
                                    {question.question_description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '40vh' }}>

                            <UploadMultiFile
                                multiple
                                files={files}
                                onDrop={handleDropMultiFile}
                                onRemove={handleRemoveFile}
                                onRemoveAll={handleRemoveAllFiles}
                                onUpload={handleUpload}
                            />
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <SubmissionList />
                    </Grid>
                </Grid>
            </Container>
        </Page >
    );
}
