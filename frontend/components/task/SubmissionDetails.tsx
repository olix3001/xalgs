import { Badge, Stack, Table, Text } from "@mantine/core";

export default function SubmissionDetails({
    tests,
    task,
}: {
    [key: string]: any;
}) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "TIMEOUT":
                return "yellow";
            case "WRONG ANSWER":
                return "red";
            case "COMPILATION ERROR":
                return "red";
            default:
                return "green";
        }
    };

    return (
        <Stack>
            <Stack>
                <Table>
                    <thead>
                        <tr>
                            <th>Test</th>
                            <th>Result</th>
                            <th>Time</th>
                            <th>Memory</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tests.map((test: any) => (
                            <tr key={test.id}>
                                <td>{test.id}</td>
                                <td>
                                    <Badge
                                        color={getStatusColor(
                                            test.errorMessage
                                        )}
                                    >
                                        {test.success
                                            ? "OK"
                                            : test.errorMessage}
                                    </Badge>
                                </td>
                                <td>
                                    {(test.executionTime / 1000).toFixed(2)}s /{" "}
                                    {task.timeLimit}s
                                </td>
                                <td>
                                    {test.memory}kb / {task.memLimit}kb
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Stack>
        </Stack>
    );
}
