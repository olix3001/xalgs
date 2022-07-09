import { Paper, Tabs, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { Head } from "next/document";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Notebook, Send } from "tabler-icons-react";
import constants from "../../../app/constants";

import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { Stat } from "../../../components/task/Stat";

export default function Problem() {
  const router = useRouter();
  const { pid } = router.query;

  const [data, setData] = useState({
    name: "Loading...",
    message: "Loading...",
    memLimit: "-1",
    timeLimit: "-1",
  });

  const loadData = async () => {
    if (pid == undefined) return;
    const r = await axios
      .get(constants.SERVER_URL + "/task/" + pid)
      .catch(() => {
        showNotification({
          color: "red",
          title: "Error",
          message: "Could not load problem details, please try again later",
        });
      });

    if (r) {
      setData(r.data);
      console.log(r.data);
    }
  };

  useEffect(() => {
    loadData();
  }, [pid, router]);

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

        <Tabs.Tab label="Submit" icon={<Send size={14} />}></Tabs.Tab>
      </Tabs>
    </>
  );
}
