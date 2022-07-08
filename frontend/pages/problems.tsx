import { showNotification } from "@mantine/notifications";
import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import constants from "../app/constants";
import { TaskList } from "../components/tasks/TaskList";

const Home: NextPage = () => {
  const [tasks, setTasks] = useState([]);
  const loadTasks = async () => {
    const r = await axios.get(constants.SERVER_URL + "/task").catch(() =>
      showNotification({
        color: "red",
        title: "Error",
        message: "Could not load tasks, please try again later",
      })
    );

    if (r) {
      setTasks(
        r.data.map((e: any) => ({
          id: e.id.toString(),
          name: e.name,
          stars: e.stars.toString(),
          difficulty: e.difficulty.toString(),
          completions: e.completions.toString(),
        }))
      );
    }
  };
  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <>
      <Head>
        <title>xAlgs | Problems</title>
      </Head>
      <TaskList data={tasks} />
    </>
  );
};

export default Home;
