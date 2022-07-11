import React, { useState, useEffect } from "react";
import { createStyles, Navbar, Group, Code } from "@mantine/core";
import {
  Logout,
  ClipboardList,
  ListCheck,
  UserCircle,
  Login,
  Home,
} from "tabler-icons-react";
import { Logo } from "./Logo";
import * as pkg from "../../package.json";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../app/slices/loginSlice";
import { RootState } from "../../app/store";
import Link from "next/link";
import { useRouter } from "next/router";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === "dark" ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.fn.rgba(theme.colors[theme.primaryColor][8], 0.25)
            : theme.colors[theme.primaryColor][0],
        color:
          theme.colorScheme === "dark"
            ? theme.white
            : theme.colors[theme.primaryColor][7],
        [`& .${icon}`]: {
          color:
            theme.colors[theme.primaryColor][
              theme.colorScheme === "dark" ? 5 : 7
            ],
        },
      },
    },
  };
});

export function AppNavbar() {
  const { classes, cx } = useStyles();
  const dispatch = useDispatch();
  const isLogged = useSelector((state: RootState) => state.login.isLogged);

  useEffect(() => {
    if (localStorage.getItem("Authorization")) dispatch(login());
  }, [dispatch]);

  var data = [
    { link: "/", label: "Home", icon: Home },
    { link: "/problems", label: "Problems", icon: ClipboardList },
  ];

  if (isLogged) {
    data = data.concat([
      { link: "/me/submissions", label: "My submissions", icon: ListCheck },
    ]);
  } else {
    data = data.concat([{ link: "/login", label: "Login", icon: Login }]);
  }

  const [active, setActive] = useState("Home");
  const router = useRouter();

  useEffect(() => {
    for (let e of data) {
      if (e.link == router.pathname) {
        setActive(e.label);
        break;
      }
    }
  }, [router, data]);

  const links = data.map((item) => (
    <Link href={item.link} key={item.label}>
      <a
        className={cx(classes.link, {
          [classes.linkActive]: item.label === active,
        })}
        onClick={() => {
          setActive(item.label);
        }}
      >
        <item.icon className={classes.linkIcon} />
        <span>{item.label}</span>
      </a>
    </Link>
  ));

  return (
    <Navbar height={"100vh"} width={{ sm: 300 }} p="md">
      <Navbar.Section grow>
        <Group className={classes.header} position="apart">
          <Logo />
          <Code sx={{ fontWeight: 700 }}>v{pkg.version}</Code>
        </Group>
        {links}
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        {isLogged && (
          <a
            href="#"
            className={classes.link}
            onClick={(event) => {
              event.preventDefault();
              dispatch(logout());
            }}
          >
            <Logout className={classes.linkIcon} />
            <span>Logout</span>
          </a>
        )}
      </Navbar.Section>
    </Navbar>
  );
}
