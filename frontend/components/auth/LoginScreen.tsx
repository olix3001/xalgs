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
import { useForm } from "@mantine/form";
import Link from "next/link";
import axios from "axios";
import constants from "../../app/constants";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { login } from "../../app/slices/loginSlice";

export function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const loginUser = async (values: any) => {
    const r = await axios
      .post(constants.SERVER_URL + "/auth/login", {
        email: values.email,
        password: values.password,
      })
      .catch(() => {
        showNotification({
          color: "red",
          title: "Error",
          message: "Could not login, check your data and try again",
        });
      });
    if (r) {
      showNotification({
        color: "green",
        title: "Success",
        message: "You are now logged in",
      });
      localStorage.setItem("Authorization", r.data.access_token);
      dispatch(login());
      router.push("/problems");
    }
  };

  return (
    <Container size={500} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{" "}
        <Link href="/register">
          <Anchor<"a"> size="sm">Create account</Anchor>
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit((values) => loginUser(values))}>
          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
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
            <Checkbox label="Remember me" {...form.getInputProps("remember")} />
            <Anchor<"a">
              onClick={(event) => event.preventDefault()}
              href="#"
              size="sm"
            >
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth type="submit" mt="xl">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
