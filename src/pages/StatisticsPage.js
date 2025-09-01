import React from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StatisticsPage = ({ shortenedUrls }) => (
  <Box p={3} maxWidth={800} mx="auto">
    <Typography variant="h4" mb={3}>Shortened URLs Statistics</Typography>
    {shortenedUrls.length === 0 ? (
      <Typography>No URLs shortened yet.</Typography>
    ) : (
      shortenedUrls.map(({ shortcode, longUrl, expiry, clicks = [] }, idx) => (
        <Accordion key={idx} sx={{mb:2}}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`Shortcode: ${shortcode} (Expires: ${new Date(expiry).toLocaleString()})`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography><b>Original URL:</b> {longUrl}</Typography>
            <Typography><b>Total Clicks:</b> {clicks.length}</Typography>

            <Table size="small" sx={{mt:2}}>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clicks.map((click, i) => (
                  <TableRow key={i}>
                    <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{click.source}</TableCell>
                    <TableCell>{click.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      ))
    )}
  </Box>
);

export default StatisticsPage;

