import { FC, useState } from 'react';
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  Text,
  UnstyledButton,
  createStyles,
  rem,
} from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NavLink } from '@/services/NavLink';
// import {
//   IconCalendarStats,
//   IconChevronLeft,
//   IconChevronRight,
// } from '@tabler/icons-react';

const useStyles = createStyles(theme => ({
  control: {
    fontWeight: 500,
    display: 'block',
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  link: {
    fontWeight: 500,
    display: 'block',
    textDecoration: 'none',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    paddingLeft: rem(31),
    marginLeft: rem(30),
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    borderLeft: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  chevron: {
    transition: 'transform 200ms ease',
  },
  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({
        variant: 'light',
        color: 'yellow',
      }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
        .color,
      // [`& .${getStylesRef('icon')}`]: {
      //   color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
      //     .color,
      // },
    },
  },
}));

interface LinksGroupProps {
  //   icon: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string; exact: boolean }[];
}

export const LinksGroup: FC<LinksGroupProps> = props => {
  const {
    //   icon: Icon,
    label,
    initiallyOpened,
    links,
  } = props;
  const { classes, cx } = useStyles();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const [active, setActive] = useState('');
  //   const ChevronIcon = theme.dir === 'ltr' ? IconChevronRight : IconChevronLeft;

  const items = (hasLinks ? links : []).map(link => (
    <NavLink
      href={link.link}
      key={link.label}
      onClick={event => {
        setActive(link.label);
      }}
      exact={link.exact}
    >
      {link.label}
    </NavLink>
  ));

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened(o => !o)}
        className={classes.control}
      >
        <Group position="apart" spacing={0}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* <ThemeIcon variant="light" size={30}>
              <Icon size="1.1rem" />
            </ThemeIcon> */}
            <Box ml="md">{label}</Box>
          </Box>
          {/* {hasLinks && (
            <ChevronIcon
              className={classes.chevron}
              size="1rem"
              stroke={1.5}
              style={{
                transform: opened
                  ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)`
                  : 'none',
              }}
            />
          )} */}
        </Group>
      </UnstyledButton>
      {hasLinks ? (
        <Collapse in={opened} className="pl-10">
          {items}
        </Collapse>
      ) : null}
    </>
  );
};

export function NavbarLinksGroup(data: any) {
  return (
    <Box
      sx={theme => ({
        minHeight: rem(220),
        padding: theme.spacing.md,
        backgroundColor:
          theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
      })}
    >
      <LinksGroup {...data} />
    </Box>
  );
}
 