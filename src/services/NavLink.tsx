import React, { FC } from 'react';
import Link, { LinkProps } from 'next/dist/client/link';
import { usePathname, useRouter } from 'next/navigation';
import { createStyles, rem } from '@mantine/core';

type NavLinkProps = LinkProps & {
  exact: boolean;
  href: string;
  children: any;
  className?: string;
};

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
    display: 'flex',
    textDecoration: 'none',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    paddingLeft: rem(31),
    // marginLeft: rem(30),
    // fontSize: theme.fontSizes.sm,
    width: '100%',
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

export const NavLink: FC<NavLinkProps> = props => {
  const { exact, href, ...restProps } = props;
  const pathname = usePathname();
  const { classes, cx } = useStyles();
  const isActive = exact ? pathname === href : pathname?.startsWith(href);

  // if (isActive) {
  //   restProps.className += 'active';
  // }

  return (
    <Link
      href={href}
      {...restProps}
      className={cx(classes.link, {
        [classes.linkActive]: isActive,
      })}
    ></Link>
  );
};
