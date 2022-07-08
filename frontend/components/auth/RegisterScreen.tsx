import React from "react";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import Link from "next/link";
import { useForm } from "@mantine/form";
import constants from "../../app/constants";
import axios from "axios";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";

export function RegisterScreen() {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
      sellData: false,
    },

    validate: {
      username: (value) =>
        value.length > 4 && value.length < 18
          ? null
          : "Username length must be between 4 and 18",
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length > 8 && value.length < 30
          ? null
          : "Password length must be between 8 and 30",
    },
  });

  const registerUser = async (values: any) => {
    const r = await axios
      .post(constants.SERVER_URL + "/auth/register", {
        username: values.username,
        email: values.email,
        password: values.password,
      })
      .catch(() => {
        showNotification({
          color: "red",
          title: "Error",
          message: "Could not create an account, please try again",
        });
      });
    if (r) {
      showNotification({
        color: "green",
        title: "Success",
        message: "Your account has been created, you can login now",
      });
      router.push("/login");
    }
  };

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Welcome!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Already have an account?{" "}
        <Link href="/login">
          <Anchor<"a"> size="sm">Login</Anchor>
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit((values) => registerUser(values))}>
          <TextInput
            label="Username"
            placeholder="ProblemSolver2000"
            required
            {...form.getInputProps("username")}
          />
          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            mt="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          <Group position="apart" mt="md">
            <Checkbox
              label="I agree to sell my data"
              {...form.getInputProps("sellData")}
            />
          </Group>
          <Button fullWidth type="submit" mt="xl">
            Sign up
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
