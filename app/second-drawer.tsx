import {
  Box,
  CloseButton,
  Container,
  HStack,
  Heading,
  ListItem,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { useResizeObserver } from "@react-hookz/web";
import { useCallback, useEffect, useRef, useState } from "react";
import { Drawer } from "vaul";

interface Props {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

type SnapPoint = string | number;
const FIXED_SNAP_POINTS: SnapPoint[] = [];
const FALLBACK_SNAP_POINT = "300px";

export default function SecondDrawer({ isOpen, setOpen }: Props) {
  const [snapPoint, setSnapPoint] = useState<SnapPoint | null>(
    FALLBACK_SNAP_POINT
  );
  const [snapPoints, setSnapPoints] = useState<SnapPoint[]>([
    ...FIXED_SNAP_POINTS,
    FALLBACK_SNAP_POINT,
  ]);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  // 一番上のスナップポイントを中身の高さに合わせるやつ
  const handleResize = useCallback(() => {
    const content = contentRef.current;
    if (!content) {
      return;
    }

    // ウインドウサイズの方が小さそうな場合はよしなにする
    const contentHeight = content.clientHeight;
    const windowHeight = window.innerHeight;
    const height = Math.min(contentHeight, windowHeight - 100);
    const dynamicPoint = `${height}px`;
    const snapPoints = [...FIXED_SNAP_POINTS, dynamicPoint];

    setSnapPoints(snapPoints);
    setSnapPoint((prev) => {
      if (!prev || !snapPoints.includes(prev)) {
        return dynamicPoint;
      }
      return prev;
    });
  }, []);

  const handleMountContent = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        contentRef.current = node;
        handleResize();
      }
    },
    [handleResize]
  );

  useResizeObserver(contentRef, () => {
    handleResize();
  });

  useEffect(() => {
    const v = window.visualViewport;
    if (!v) {
      return;
    }
    v.addEventListener("resize", handleResize);

    return () => {
      v.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return (
    <Drawer.Root
      open={isOpen}
      onClose={handleClose}
      onOpenChange={setOpen}
      snapPoints={snapPoints}
      activeSnapPoint={snapPoint}
      setActiveSnapPoint={setSnapPoint}
    >
      <Drawer.Portal>
        <Box
          as={Drawer.Content}
          bg="gray.50"
          roundedTop={10}
          h="100%"
          position="fixed"
          bottom={0}
          right={0}
          left={0}
          shadow="dark-lg"
          outline={0}
        >
          <VStack py={4} gap={4} ref={handleMountContent}>
            <Box
              mx="auto"
              width={14}
              h={1.5}
              flexShrink={0}
              rounded="full"
              bg="gray.200"
              shadow="inner"
              onClick={handleClose}
            />

            <Container maxW="container.xl">
              <VStack gap={4} alignItems="flex-start">
                <HStack w="full" justify="space-between">
                  <Heading as={Drawer.Title} size="lg">
                    👶 2nd drawer content
                  </Heading>

                  <CloseButton onClick={() => setOpen(false)} />
                </HStack>

                <UnorderedList>
                  <ListItem>👇 Dismissible</ListItem>
                  <ListItem>
                    ❌ Not able to touch/scroll parent content
                  </ListItem>
                  <ListItem>1 snap point (dynamic only)</ListItem>
                </UnorderedList>
              </VStack>
            </Container>
          </VStack>
        </Box>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
