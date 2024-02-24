"use client";

import { Box, Container } from "@chakra-ui/react";
import { useState } from "react";
import FirstDrawer from "./first-drawer";
import SecondDrawer from "./second-drawer";

export default function Home() {
  const [isOpen, setOpen] = useState(false);

  return (
    <Container>
      <Box height="5000px" bg="red.100">
        Super long main content
      </Box>

      <FirstDrawer onOpenSecondDrawer={() => setOpen(true)} />
      <SecondDrawer isOpen={isOpen} setOpen={setOpen} />
    </Container>
  );
}
