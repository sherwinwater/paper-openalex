"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'

import React, { useState } from "react";

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      
      <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>

      
      </QueryClientProvider>
  );
};

export default QueryProvider;
