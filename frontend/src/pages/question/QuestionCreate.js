import { useParams } from 'react-router-dom';

// @mui
import { Container, Card } from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

import QuestionForm from "./QuestionForm"

// ----------------------------------------------------------------------

export default function QuestionCreate() {

    const { id } = useParams();


    return (
        <Page title="Create Question" sx={{ height: 1 }}>
            <Container maxWidth={false} sx={{ height: 1 }}>
                <HeaderBreadcrumbs
                    heading="Create Question"
                    links={[
                        {
                            name: 'Dashboard',
                            href: PATH_DASHBOARD.root,
                        },
                        {
                            name: id,
                            href: `${PATH_DASHBOARD.question.root}/${id}/list`,
                        },
                        {
                            name: 'Create Question',
                        },
                    ]}
                />
                 <Card sx={{ minWidth: 275 }}>
                   <QuestionForm cycleId={id} />
                </Card>

            </Container>
        </Page>
    );
}
