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
  Container,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import buildWords from "@/utils/build-words";
import { IconSearch } from "@tabler/icons-react";

interface Props {
  doi: string;
}

const fetchCandidatesFromAPI = async ({ doi }: Props) => {
  const response = await fetch(
    `https://api.openalex.org/works/${doi}?select=abstract_inverted_index`
  );
  return response.json();
};

export default function Abstract() {
  const [doi, setDoi] = useState("");
  const [abstract, setAbstract] = useState("");

  const { data, isLoading, isError, isFetching } = useQuery({
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
    <Container>
      <Box mx="auto" mt={40}>
        <form
          onSubmit={form.onSubmit((values) => {
            setDoi(values.searchText);
          })}
        >
          <Group position="center" mt="md">
            <TextInput
              placeholder="Search for an abstract"
              size="lg"
              radius="md"
              style={{ width: 500 }}
              {...form.getInputProps("searchText")}
            />

            <Button
              type="submit"
              color="blue"
              variant="filled"
              size="lg"
              rightIcon={<IconSearch color="white" size={20} />}
              style={{ marginBottom: form.errors.searchText ? "24px" : "0px" }}
            >
              Search
            </Button>
          </Group>
        </form>
      </Box>

      {isFetching && doi && (
        <Center mt={40}>
          <Loader />
        </Center>
      )}
      {Object.keys(data.abstract_inverted_index).length > 0 && doi && (
        <Paper shadow="xs" p="md" m={40} withBorder>
          <Center>
            <Text size="xl">Abstract</Text>
          </Center>
          <Text>{abstract} </Text>
        </Paper>
      )}

      {isError && (
        <Center mt={40}>
          <Text>Server error and try it later</Text>
        </Center>
      )}
    </Container>
  );
}
