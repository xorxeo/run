'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { EventsList } from './eventsList';
import { use, useEffect, useRef, useState } from 'react';

import {
  Box,
  Collapse,
  Navbar,
  ScrollArea,
  createStyles,
  rem,
} from '@mantine/core';
import { LinksGroup } from './LinksGroup';
import { NavLink } from '@/services/NavLink';

type SidebarItem = {
  title: string;
  path: string;
};

type Links = {
  label: string;
  link: string;
  exact: boolean;
};

type NavbarItems = {
  label: string;
  links: Links[];
};

type SidebarChapter = 'Events Management' | 'Distances Management';

type Item = {
  [key in SidebarChapter]?: SidebarItem[];
};

const items: Item = {
  'Events Management': [
    { path: '/admin/createEvent', title: 'Create new event' },
    { path: '/admin/createEvent/edit/event', title: 'Edit event' },
  ],

  'Distances Management': [
    {
      path: '/admin/createDistance',
      title: 'Create new distance',
    },
    {
      path: '/admin/createDistance/edit/distance',
      title: 'Edit distance',
    },
  ],
};

const data: NavbarItems[] = [
  {
    label: 'Events',
    links: [
      { label: 'Create new event', link: '/admin/createEvent', exact: true },
      {
        label: 'Edit event',
        link: '/admin/createEvent/edit/event',
        exact: false,
      },
    ],
  },
  {
    label: 'Distances',
    links: [
      {
        label: 'Create new distance',
        link: '/admin/createDistance',
        exact: true,
      },
      {
        label: 'Edit distance',
        link: '/admin/createDistance/edit/distance',
        exact: false,
      },
    ],
  },
  {
    label: 'Create Map',
    links: [
      {
        label: 'Create Map',
        link: '/admin/createMap',
        exact: true,
      },
    ],
  },
];

export const Sidebar = () => {
  const links = data.map(item => <LinksGroup {...item} key={item.label} />);

  return (
    <div className="side-bar-container flex flex-col w-full ">
      <Navbar.Section grow mt="xl">
        {links}
      </Navbar.Section>
    </div>
  );
};
