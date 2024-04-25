/* eslint-disable */

import * as Yup from 'yup';
import { useCallback, useState } from 'react';

import { useNavigate } from 'react-router-dom';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

// @mui
import { Stack, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { styled } from '@mui/material/styles';

import { PATH_DASHBOARD } from '../../routes/paths';

// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';
// components
import { FormProvider, RHFTextField, RHFSelect } from '../../components/hook-form';

//import UploadFile from './UploadFile';
import ReuseList from './ReuseList';



const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  width: 140,
  fontSize: 13,
  flexShrink: 0,
  color: theme.palette.text.secondary,
}));

export default function QuestionForm(cycleId) {

  const [open, setOpen] = useState(false);
  const [openReuseDialog, setOpenReuseDialog] = useState(false);

  const handleOpenReuseDialog = () => setOpenReuseDialog(true);
  const handleCloseReuseDialog = () => setOpenReuseDialog(false);

  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);

  const isMountedRef = useIsMountedRef();

  const QuestionSchema = Yup.object().shape({
    // questionId: Yup.string().required('Question ID is required'),
    title: Yup.string().required('Question Name is required'),
    cs_hr: Yup.string().required('Employee name is required'),
    question_description: Yup.string().required('Description is required'),
    question_type : Yup.string().required('Question Type is required'),
  });

  const defaultValues = {
    title: '',
    cs_hr: '',
    question_description: '',
    cycleId: Object.values(cycleId)[0],
    question_type : ''
  };

  const methods = useForm({
    resolver: yupResolver(QuestionSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const values = watch();

  const handleFile = (file) => {
    // Define a new file reader
    const reader = new FileReader();

    // Create a new promise
    return new Promise(resolve => {

      // Resolve the promise after reading file
      reader.onload = () => resolve(reader.result);

      // Read the file as a text
      reader.readAsText(file);
    });
  }

  // const handleChangeFile = (file) => {
  //     const fileData = new FileReader();
  //     fileData.onloadend = handleFile;
  //     fileData.readAsText(file);
  // }

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setValue(
        'files',
        acceptedFiles.map((file, index) => {
          return Object.assign(file, {
            preview: URL.createObjectURL(file),
            text: handleFile(file)
          })
        }

        )
      );
    },
    [setValue]
  );

  const handleRemoveAll = () => {
    setValue('files', []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.images?.filter((_file) => _file !== file);
    setValue('files', filteredItems);
  };





  const onSubmit = async (data) => {

    try {
      console.log("creating data...")
      //console.log(data.cycleId)
      await axios.post('https://t99hwkreli.execute-api.us-east-1.amazonaws.com/default/postQuestion', data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // .then((res) => {
      //           setLoading(false);
      //           setUserList2(Object.values(res.data));
      //         });
      //   await register(data.email, data.password, data.firstName, data.lastName, formattedDate);
    } catch (error) {
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', error);
      }
      console.log(error);
    }


    try{ await axios.patch(`http://127.0.0.1:5000/question_count_update/${data.cycleId}/add`);}

    catch (error) {console.log(error);}
    

    setOpen(true);
  };



  const stopSubmit = async (e, data) => {
    e.preventDefault();
    console.log(data);
  }


  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        keepMounted
        aria-describedby="alert-dialog-description"
        maxWidth='md'
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">
          {"Question Creation Tab"}
        </DialogTitle>
        <DialogContent sx={{ p: 3, m: 2 }}>

          <DialogContentText id="alert-dialog-description">
            Question has been successfully created! Click continue to redirect back to the list of questions.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate(`${PATH_DASHBOARD.question.root}/${Object.values(cycleId)[0]}/list`)} autoFocus>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Stack spacing={3} sx={{ p: 2, m: 2 }}>
          {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="title" label="Question Name" />
            <RHFTextField name="cycleId" label="Cycle Id" disabled />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="cs_hr" label="Employee" />
            <RHFSelect name="question_type" label="Type of Question" placeholder="Individual/Project">
                <option value="" />
                <option value="Individual"> Individual Files </option>
                <option value="ZIP File"> Zip File (Project Based) </option>
              </RHFSelect>
          </Stack>

          <RHFTextField name="question_description" label="Description" />

          {/* <RHFUploadMultiFile
            name="files"
            showPreview
            maxSize={3145728}
            onDrop={handleDrop}
            onRemove={handleRemove}
            onRemoveAll={handleRemoveAll}
          /> */}

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Create Question
          </LoadingButton>
          <Typography variant='h5' color='text.secondary' align="center">
            OR
          </Typography>
          <Button fullWidth size="large" type="submit" variant="contained" onClick={handleOpenReuseDialog} color="info">
            Reuse Question
          </Button>
          <Dialog
            open={openReuseDialog}
            onClose={handleCloseReuseDialog}
            fullWidth
            maxWidth="lg"
          >
            <DialogTitle id="responsive-dialog-title">
              {"Reuse a Question"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please select the question to be reused.
              </DialogContentText>
              <ReuseList/>
            </DialogContent>
          </Dialog>

        </Stack>
      </FormProvider>

    </div>

  );
}
