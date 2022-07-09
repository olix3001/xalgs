import { Paper, Tabs, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { Head } from "next/document";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Notebook } from "tabler-icons-react";
import constants from "../../../app/constants";

import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

export default function Problem() {
  const router = useRouter();
  const { pid } = router.query;

  const [data, setData] = useState({
    name: "Loading...",
    message: "Loading...",
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
          <Paper withBorder p="md">
            <Latex>{data.message}</Latex>
          </Paper>
        </Tabs.Tab>
      </Tabs>
    </>
  );
}
