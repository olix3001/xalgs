import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useState, useEffect } from "react";
import axios from "axios";
import constants from "../../app/constants";
import {
    Button,
    Group,
    Input,
    Paper,
    Select,
    Stack,
    Text,
    Textarea,
} from "@mantine/core";

export default function SubmitSolution({ pid }: { pid: string }) {
    const form = useForm({
        initialValues: {
            code: "",
            language: "",
        },
    });

    useEffect(() => {
        axios
            .get(`${constants.SERVER_URL}/task`)
            .then((res: any) => setProblems(res.data.map((e: any) => e.name)))
            .catch(() =>
                showNotification({
                    color: "red",
                    title: "Error",
                    message: "Could not load problems, please try again later",
                })
            );
    }, [pid]);

    const [problems, setProblems] = useState(["Loading..."]);
    const [isCodePasted, setIsCodePasted] = useState(false);

    const submitSolution = (solution: { code: string; language: string }) => {
        axios
            .post(
                `${constants.SERVER_URL}/task/${pid}/submit`,
                {
                    sourceCode: solution.code,
                    lang: solution.language,
                },
                {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("Authorization"),
                    },
                }
            )
            .then((r) => {
                showNotification({
                    color: "green",
                    title: "Submitted",
                    message: `Your solution has been submitted successfully, you can check results in "My submissions" tab (id: ${r.data.submissionId})`,
                });
            })
            .catch(() => {
                showNotification({
                    color: "red",
                    title: "Error",
                    message: "Something went wrong, please try again",
                });
            });
    };

    const exampleCode = `int main() {
    return 0;
}`;

    return (
        <Paper
            p={12}
            sx={{
                width: "50%",
                "@media (max-width: 750px)": {
                    width: "100%",
                },
            }}
        >
            <Stack>
                <Text size="xl">Submit solution</Text>
                <form
                    onSubmit={form.onSubmit((values) => submitSolution(values))}
                >
                    <Textarea
                        label="Code"
                        placeholder={exampleCode}
                        autosize
                        minRows={3}
                        onInput={(e: any) => {
                            if (
                                e.currentTarget.value &&
                                e.currentTarget.value != ""
                            )
                                setIsCodePasted(true);
                            else setIsCodePasted(false);
                        }}
                        {...form.getInputProps("code")}
                    />

                    <Select
                        label="Programming language"
                        data={["Python"]}
                        required={isCodePasted}
                        disabled={!isCodePasted}
                        mt={10}
                        {...form.getInputProps("language")}
                    />

                    <Group position="right">
                        <Button type="submit" mt={10}>
                            Submit
                        </Button>
                    </Group>
                </form>
            </Stack>
        </Paper>
    );
}
