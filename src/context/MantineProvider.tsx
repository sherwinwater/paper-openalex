"use client";

import { MantineProvider as DefaultMantineProvider } from "@mantine/core";

export default function MantineProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DefaultMantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "light",
      }}
    >
      {children}
    </DefaultMantineProvider>
  );
}
