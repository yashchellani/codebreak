/* eslint-disable */

import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { m } from 'framer-motion';
import { useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import { CardContent, Box, Card, Typography, Link, Button, Stack } from '@mui/material';
import { CodeBlock, dracula } from "react-code-blocks";
// _mock_
import { _appFeatured } from '../../_mock';
// components
import Image from '../../components/Image';
import { MotionContainer, varFade } from '../../components/animate';
import { CarouselDots, CarouselArrows } from '../../components/carousel';
import { indexOf } from 'lodash';

// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 8,
    position: 'absolute',
    backgroundColor: alpha(theme.palette.grey[900], 0.64),
}));

// ----------------------------------------------------------------------

export default function CodeCarousel({ code, similarityObjects, scoreIndex, setScoreIndex, highlight, similarCodes, setCurr }) {
    const theme = useTheme();
    const carouselRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(theme.direction === 'rtl' ? _appFeatured.length - 1 : 0);

    const settings = {
        // speed: 800,
        dots: false,
        arrows: false,
        autoplay: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        rtl: Boolean(theme.direction === 'rtl'),
        beforeChange: (current, next) => setCurrentIndex(next),
        ...CarouselDots({
            zIndex: 9,
            top: 24,
            left: 24,
            position: 'absolute',
        }),
    };

    const handlePrevious = () => {
        carouselRef.current.slickPrev();
        scoreIndex = (scoreIndex - 1) < 0 ? similarityObjects.length - 1 : scoreIndex - 1
        setScoreIndex(scoreIndex)
        if(highlight) setCurr(similarityObjects[scoreIndex].candidate_lines);
        else setCurr("")
    };

    const handleNext = () => {
        carouselRef.current.slickNext();
        scoreIndex = (scoreIndex + 1) % similarityObjects.length;
        setScoreIndex(scoreIndex)
        if(highlight) setCurr(similarityObjects[scoreIndex].candidate_lines);
        else setCurr("")
    };

    return (
        <Card>
            <Slider ref={carouselRef} {...settings}>
                {similarityObjects.map((app, index) => (
                    <CarouselItem item={app} isActive={index === currentIndex} code={similarityObjects[index].user_submission} highlight={highlight} />
                ))}
            </Slider>

            <CarouselArrows
                onNext={handleNext}
                onPrevious={handlePrevious}
                spacing={0}
                sx={{
                    top: 16,
                    right: 16,
                    position: 'absolute',
                    '& .arrow': {
                        p: 0,
                        width: 32,
                        height: 32,
                        opacity: 0.48,
                        color: 'common.white',
                        '&:hover': { color: 'common.white', opacity: 1 },
                    },
                }}
            />
        </Card>
    );
}

// ----------------------------------------------------------------------



function CarouselItem({ item, code, highlight }) {
    const { reference_id, reference_lines } = item;

    return (
        <Card sx={{ px: 3, pb: 3, width: 1 }}>
            <Stack spacing={3} justifyContent="space-between" >
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <div />
                    <CardContent sx={{ py: 3, px: 0 }}>
                        <Typography sx={{
                            fontSize: 20
                        }} color="text.primary" gutterBottom variant='h4' align="center">
                            Similar Submissions
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary" align="center">
                            {reference_id}
                        </Typography>
                    </CardContent>
                    <div />
                </Stack>
                <Box sx={{ height: 500, overflowY: 'scroll' }}>
                    <CodeBlock
                        text={code}
                        language={"java"}
                        theme={dracula}
                        highlight={highlight ? reference_lines : ""}
                    />
                </Box>

            </Stack>
        </Card>
    );
}
