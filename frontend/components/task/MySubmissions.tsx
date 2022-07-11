import {
    Accordion,
    Badge,
    Button,
    Group,
    LoadingOverlay,
    MediaQuery,
    Modal,
    Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import constants from "../../app/constants";
import SubmissionDetails from "./SubmissionDetails";
import { Prism } from "@mantine/prism";
import { Language } from "prism-react-renderer";
import { Code, FileDownload } from "tabler-icons-react";

export default function MySubmissions({ pid }: { pid?: string }) {
    const centerDiv = {
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    };

    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        if (submissions.length == 0)
            axios
                .get(
                    `${constants.SERVER_URL}/submissions/my${
                        pid ? "/" + pid : ""
                    }`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "Authorization"
                            )}`,
                        },
                    }
                )
                .then((r) => {
                    setSubmissions(
                        r.data.map((e: any) => {
                            e.submittedAt = new Date(e.submittedAt);
                            return e;
                        })
                    );
                })
                .catch(() => {
                    showNotification({
                        color: "red",
                        title: "Error",
                        message:
                            "Could not load your submissions, please try again later",
                    });
                });
    }, [pid]);

    const [isPdfGenerating, setPdfGenerating] = useState(false);

    const downloadSummary = (sid: number) => {
        axios
            .get(`${constants.SERVER_URL}/submissions/summary/${sid}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "Authorization"
                    )}`,
                },
                responseType: "blob",
            })
            .then((res) => {
                let fileName = `xalgs-summary-${sid}.pdf`;
                let blob = new Blob([res.data]);
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.style.display = "none";
                link.href = url;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                setPdfGenerating(false);
            })
            .catch(() => {
                showNotification({
                    color: "red",
                    title: "Error",
                    message: "Could not generate PDF, please try again",
                });
                setPdfGenerating(false);
            });
    };

    const [codeOpened, setCodeOpened] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(-1);
    const [isCodeLoading, setCodeLoading] = useState(true);
    const [codeData, setCodeData] = useState({
        code: "",
        lang: "",
        id: -1,
    });

    useEffect(() => {
        if (selectedSubmission != -1)
            axios
                .get(
                    `${constants.SERVER_URL}/submissions/code/${selectedSubmission}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "Authorization"
                            )}`,
                        },
                    }
                )
                .then((r) => {
                    setCodeData(r.data);
                    setCodeLoading(false);
                })
                .catch(() => {
                    showNotification({
                        color: "red",
                        title: "Error",
                        message: "Could not load source code",
                    });
                    setCodeOpened(false);
                });
    }, [selectedSubmission]);

    const langMap: { [key: string]: Language } = {
        "": "cpp",
        Python: "python",
    };

    return (
        <>
            <Modal
                opened={codeOpened}
                onClose={() => setCodeOpened(false)}
                title="Source Code"
            >
                <LoadingOverlay visible={isCodeLoading} />
                {!isCodeLoading && (
                    <Prism withLineNumbers language={langMap[codeData.lang]}>
                        {codeData.code}
                    </Prism>
                )}
            </Modal>
            <Accordion iconPosition="right">
                {submissions.map((subm: any) => (
                    <Accordion.Item
                        label={
                            <div
                                style={{
                                    display: "flex",
                                    alignContent: "center",
                                    justifyContent: "space-evenly",
                                }}
                            >
                                <MediaQuery
                                    smallerThan="md"
                                    styles={{ display: "none" }}
                                >
                                    <Text style={{ width: "100%" }}>
                                        {subm.submittedAt.toUTCString()}
                                    </Text>
                                </MediaQuery>

                                <div style={centerDiv}>
                                    <Badge color="cyan" mx={6}>
                                        {subm.lang}
                                    </Badge>
                                </div>

                                <div style={centerDiv}>
                                    <Link
                                        href={"/problem/" + subm.task.id}
                                        passHref
                                    >
                                        <Button
                                            style={{ cursor: "pointer" }}
                                            component="a"
                                            variant="subtle"
                                            compact
                                        >
                                            {subm.task.name}
                                        </Button>
                                    </Link>
                                </div>

                                <div style={centerDiv}>
                                    <Badge
                                        color={
                                            subm.isTested ? "green" : "yellow"
                                        }
                                        mx={6}
                                    >
                                        {subm.isTested ? "TESTED" : "PENDING"}
                                    </Badge>
                                </div>

                                <div style={centerDiv}>
                                    <Badge
                                        color={
                                            subm.isTested
                                                ? subm.isSuccess
                                                    ? "green"
                                                    : "red"
                                                : "yellow"
                                        }
                                        mx={6}
                                    >
                                        {subm.isTested
                                            ? `${
                                                  subm.TestResults.filter(
                                                      (e: any) => e.success
                                                  ).length
                                              }/${subm.TestResults.length}`
                                            : "UNKNOWN"}
                                    </Badge>
                                </div>
                            </div>
                        }
                        key={subm.id}
                    >
                        <Group grow>
                            <Button
                                variant="outline"
                                leftIcon={<Code />}
                                mb="md"
                                onClick={() => {
                                    if (subm.id != selectedSubmission) {
                                        setSelectedSubmission(subm.id);
                                        setCodeLoading(true);
                                    }
                                    setCodeOpened(true);
                                }}
                            >
                                Show source code
                            </Button>
                            <Button
                                variant="outline"
                                leftIcon={<FileDownload />}
                                mb="md"
                                loading={isPdfGenerating}
                                onClick={() => {
                                    setPdfGenerating(true);
                                    downloadSummary(subm.id);
                                }}
                            >
                                Download results as pdf
                            </Button>
                        </Group>
                        {subm.isTested ? (
                            <SubmissionDetails
                                tests={subm.TestResults}
                                task={subm.task}
                            />
                        ) : (
                            <h2>
                                This submission is in queue, please wait for
                                results
                            </h2>
                        )}
                    </Accordion.Item>
                ))}
            </Accordion>
        </>
    );
}
