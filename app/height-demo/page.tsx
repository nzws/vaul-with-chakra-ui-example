"use client";

import { Box, Container } from "@chakra-ui/react";

export default function Home() {
  return (
    <Container>
      <Box height="5000px" bg="red.100">
        Super long main content
      </Box>

      <Box
        height="100px"
        bg="blue.100"
        bottom={0}
        position="fixed"
        width="100%"
      >
        Bottom
      </Box>
    </Container>
  );
}
