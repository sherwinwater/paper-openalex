"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  TextInput,
  Text,
  Paper,
  Button,
  Group,
  Box,
  Center,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import buildWords from "@/utils/build-words";
import { useMantineTheme } from "@mantine/core";

interface Props {
  doi: string;
}

const fetchCandidatesFromAPI = async ({ doi }: Props) => {
  const response = await fetch(
    `https://api.openalex.org/works/${doi}?select=abstract_inverted_index`
  );
  return response.json();
};

// https://doi.org/10.7717/peerj.4375

export default function Abstract() {
  const [doi, setDoi] = useState("");
  const [abstract, setAbstract] = useState("");
  const theme = useMantineTheme();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["abstract", doi],
    queryFn: () => fetchCandidatesFromAPI({ doi }),
    enabled: !!doi,
    initialData: { abstract_inverted_index: {} },
    onSuccess: (data: {
      abstract_inverted_index: { [key: string]: number[] };
    }) => {
      setAbstract(buildWords(data.abstract_inverted_index));
    },
  });

  const form = useForm({
    initialValues: {
      searchText: "",
    },

    validate: {
      searchText: (value) => (value.length > 0 ? null : "Invalid searchText"),
    },
  });

  return (
    <div>
      <Box maw={1000} mx="auto" mt={40}>
        <form
          onSubmit={form.onSubmit((values) => {
            setDoi(values.searchText);
          })}
        >
          <TextInput
            placeholder="Type doi to search"
            {...form.getInputProps("searchText")}
          />

          <Group position="center" mt="md">
            <Button type="submit">Search</Button>
          </Group>
        </form>
      </Box>

      {isLoading && !doi && <Loader />}

      {data && doi && (
        <Paper shadow="xs" p="md" m={40}>
          <Center>
            <Text size="xl">Abstract</Text>
          </Center>
          <Text>{abstract} </Text>
        </Paper>
      )}

      {isError && <Text>Server error and try it later</Text>}
    </div>
  );
}
