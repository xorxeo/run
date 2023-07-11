'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { EventsList } from './eventsList';
import { use, useEffect, useRef, useState } from 'react';

type SidebarItem = {
  title: string;
  path: string;
};

type SidebarChapter = 'Events Management' | 'Distances Management';

type Item = {
  [key in SidebarChapter]?: SidebarItem[];
};

export const Sidebar = () => {
  const linkRefs = useRef<Array<HTMLElement | null>>([]);

  const [active, setActive] = useState('');

  const pathName = usePathname();

  const handleSetActive = (path: string) => {
    setActive(path);
  };

  const handleGoBack = () => {
    setActive('');
  };

  useEffect(() => {
    
      if (pathName) {
        setActive(pathName);
      }
      // console.log('pathName === active', pathName === active);
    
  }, [pathName]);

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

  return (
    <div className="side-bar-container flex flex-col w-full">
      {Object.entries(items).map(([key, values]) => (
        <div
          key={key}
          className="side-bar-chapter flex flex-col items-center mt-4 w-full"
        >
          <h2 className="">{key}</h2>

          {values.map((item, index) => (
            <Link
              href={item.path}
              ref={(el) => (linkRefs.current[index] = el)}
              key={item.path}
              className={`${
                active === item.path
                  ? 'sidebar-item  bg-[#FBBD23]'
                  : 'sidebar-item'
              }`}
              onClick={() => {
                handleSetActive(item.path);
              }}
            >
              {item.title}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};
