/* eslint-disable */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

// @mui
import { Stack, Card, Typography, CardContent, Container, Box, Grid,  } from '@mui/material';
import { CodeBlock, dracula } from "react-code-blocks";
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
// components
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import CodeCarousel from './CodeCarousel';
import LoadingScreen from '../../components/LoadingScreen';


// ----------------------------------------------------------------------

export default function CompareCode() {

    const [code, setCode] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submission, setSubmission] = useState([]);
    const [question, setQuestion] = useState([]);
    const [highlight, setHighlight] = useState(false);
    const [curr, setCurr] = useState("");
    const [scoreIndex, setScoreIndex] = useState(0);
    const [similarityObjects, setSimilarityObjects] = useState([]);
    const [similarCodes, setSimilarCodes] = useState([]);

    const { cycleId, questionId, id } = useParams();

    useEffect(() => {
        const initialize = async () => {
            try {
                await axios.get(`https://t99hwkreli.execute-api.us-east-1.amazonaws.com/default/getSubmissionMetadataById/?account_id=${id}`).then((res) => {
                    setSubmission(res.data[0])
                });
                await axios.get(`https://t99hwkreli.execute-api.us-east-1.amazonaws.com/default/getQuestionById/?question_hash=${questionId}&cycleId=${cycleId}`).then((res) => {
                    setQuestion(res.data)
                });
                await axios.get(`https://t99hwkreli.execute-api.us-east-1.amazonaws.com/default/getSubmissionById/?questionId=${questionId}&filename=${id}.java`).then((res) => {
                    setCode(res.data)
                });
                const dataUrls = [];
                await axios.get(`http://127.0.0.1:5000/comparison/${id}`).then((res) => {

                    res.data.map((item) => (dataUrls.push(`https://t99hwkreli.execute-api.us-east-1.amazonaws.com/default/getSubmissionById/?questionId=${questionId}&filename=${item.reference_id}.java`)))
                    setSimilarityObjects(res.data);
                });
                const requests = dataUrls.map((url) => axios.get(url));
                await axios.all(requests).then((responses) => {
                    const codeData = [];
                    responses.forEach((resp, index) => {
                        codeData.push(resp.data);
                    });
                    setSimilarCodes(codeData);
                })

            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        };
        initialize();
    }, []);

    const codeBlock = `${code.user_submission}`;
    const handleClick = async () => {
        if (highlight) {
            setHighlight(false);
            setCurr("");
        } else {
            setHighlight(true);
            setCurr(similarityObjects[scoreIndex].candidate_lines);
        }
    }

    similarCodes.forEach((code, index) => {
        similarityObjects[index].user_submission = code.user_submission
    })

    similarityObjects.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <Page title="Code Review">
            <Container maxWidth={false} sx={{ height: 1 }}>
                <HeaderBreadcrumbs
                    heading={`${submission.first_name} ${submission.last_name}`}
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
                            name: `${question.title}`,
                            href: `${PATH_DASHBOARD.question.root}/${cycleId}/${questionId}`,
                        }
                    ]}
                />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ height: '42.5vh', overflow: 'auto' }}>
                            <CardContent>
                                <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom variant='h3'>
                                    {question.title}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    Owner: {question.cs_hr}
                                </Typography>
                                <Typography variant="body2">
                                    {question.question_description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ minHeight: '40vh' }}>
                            {similarityObjects.length === 0 ? <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                maxWidth="100%"
                                sx={{p: 3, m: 4}}

                            >
                                <h1> There are no similar code files </h1>
                            </Box> : <Stack direction="column" justifyContent="center" alignItems="center" padding={3}>
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    maxWidth="100%"
                                >
                                    <CircularProgressbar value={parseFloat(similarityObjects[scoreIndex].score) * 100} text={Math.round(parseFloat(similarityObjects[scoreIndex].score) * 100)} circleRatio={0.75} styles={buildStyles({
                                        textColor: "white",
                                        pathColor: "red",
                                        trailColor: "grey",
                                        rotation: 1 / 2 + 1 / 8,
                                        strokeLinecap: "butt"
                                    })} />
                                </Box>
                                <Box sx={{ mt: -1 }}>
                                    <LoadingButton onClick={handleClick} color="info" variant="contained" sx={{ p: 1 }}> Highlight Similarity </LoadingButton>
                                </Box>
                            </Stack>}
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ px: 3, pb: 3, width: 1 }}>
                            <Stack spacing={3} justifyContent="space-between" >
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <div />
                                    <CardContent sx={{ py: 3, px: 0 }}>
                                        <Typography sx={{
                                            fontSize: 20


                                        }} color="text.primary" gutterBottom variant='h4' align="center">
                                            User Submission
                                        </Typography>
                                        <Typography sx={{ mb: 1.5 }} color="text.secondary" align="center">
                                            {id}
                                        </Typography>
                                    </CardContent>
                                    <div />
                                </Stack>
                                <Box sx={{ height: 500, overflowY: 'scroll' }}>
                                    <CodeBlock
                                        text={codeBlock}
                                        language={"java"}
                                        theme={dracula}
                                        highlight={curr}
                                    />
                                </Box>
                            </Stack>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <CodeCarousel code={codeBlock} scoreIndex={scoreIndex} similarityObjects={similarityObjects} setScoreIndex={setScoreIndex} highlight={highlight} similarCodes={similarCodes} setCurr={setCurr} />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}
