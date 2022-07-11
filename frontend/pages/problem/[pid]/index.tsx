import { Paper, Tabs, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Notebook, Report, Send } from "tabler-icons-react";
import constants from "../../../app/constants";

import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { Stat } from "../../../components/task/Stat";
import SubmitSolution from "../../../components/task/SubmitSolution";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import MySubmissions from "../../../components/task/MySubmissions";

export default function Problem() {
    const router = useRouter();
    const { pid } = router.query;

    const defaultData = {
        name: "Loading...",
        message: "Loading...",
        memLimit: "-1",
        timeLimit: "-1",
    };

    const [data, setData] = useState(defaultData);

    const loadData = async () => {
        if (pid == undefined) return;
        const r = await axios
            .get(constants.SERVER_URL + "/task/" + pid)
            .catch(() => {
                showNotification({
                    color: "red",
                    title: "Error",
                    message:
                        "Could not load problem details, please try again later",
                });
            });

        if (r) {
            setData(r.data);
        }
    };

    useEffect(() => {
        if (data.name == defaultData.name) loadData();
    }, [pid, router, loadData]);

    const isLogged = useSelector((state: RootState) => state.login.isLogged);

    return (
        <>
            <h2 style={{ padding: 0, margin: 0 }}>{data.name}</h2>
            <Tabs>
                <Tabs.Tab label="View" icon={<Notebook size={14} />}>
                    <Stat
                        data={[
                            {
                                label: "MEMORY LIMIT",
                                stats: `${data.memLimit}kb`,
                            },
                            {
                                label: "TIME LIMIT",
                                stats: `${data.timeLimit}s`,
                            },
                        ]}
                    />
                    <Paper withBorder p="md" mt="sm">
                        <Latex>{data.message}</Latex>
                    </Paper>
                </Tabs.Tab>

                {isLogged && (
                    <Tabs.Tab label="Submit" icon={<Send size={14} />}>
                        <SubmitSolution
                            pid={typeof pid == "string" ? pid : ""}
                        />
                    </Tabs.Tab>
                )}

                {isLogged && (
                    <Tabs.Tab
                        label="My Submissions"
                        icon={<Report size={14} />}
                    >
                        <MySubmissions
                            pid={typeof pid == "string" ? pid : ""}
                        />
                    </Tabs.Tab>
                )}
            </Tabs>
        </>
    );
}
