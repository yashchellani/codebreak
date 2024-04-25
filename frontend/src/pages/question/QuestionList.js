import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// @mui
import { Container, Stack, Grid, Card, Typography, CardActions, CardContent, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

export default function QuestionList() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [questionList, setquestionList] = useState([]);

    useEffect(() => {
        const initialize = async () => {
            try {
                await axios.get(`https://t99hwkreli.execute-api.us-east-1.amazonaws.com/default/getQuestionListWithCycleId/?cycleId=${id}`).then((res) => {
                    setquestionList(res.data)
                });
            } catch (err) {
                console.log(err);
            }
        };
        initialize();
    }, []);

    return (
        <Page title="Questions" sx={{ height: 1 }}>
            <Container maxWidth={false} sx={{ height: 1 }}>
                <HeaderBreadcrumbs
                    heading="Questions"
                    links={[
                        {
                            name: 'Dashboard',
                            href: PATH_DASHBOARD.root,
                        },
                        { name: 'Questions' },
                    ]}
                />
                <Stack direction="row"
                    justifyContent="space-between"
                    alignItems="stretch"
                    spacing={2} sx={{ p: 2 }}><h1>{id}</h1><Button onClick={() => navigate(`${PATH_DASHBOARD.question.root}/new/${id}`)}>Add Question</Button></Stack>



                <Grid container spacing={{ xs: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>

                    {questionList.map((question, index) => (
                        <Grid item xs={12} sm={4} md={4} key={index}>
                            <Card sx={{ minWidth: 275, minHeight: 275 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom variant='h4'>
                                        {question.title}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5, overflow: 'hidden' }} color="text.secondary">
                                        Question Owner: {question.cs_hr}
                                    </Typography>
                                    <Typography variant="body2" sx={{ height: 85, overflow: 'hidden' }}>
                                        {question.question_description}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ px: 3, pb: 3, justifyContent: 'end', verticalAlign: 'bottom' }}>
                                    <Button endIcon={<ArrowForwardIcon />} variant='contained' size="small" onClick={() => navigate(`${PATH_DASHBOARD.question.root}/${id}/${question.question_hash}/view`)}>View Question</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Page>
    );
}
