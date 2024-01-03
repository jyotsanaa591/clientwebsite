'use client';
import React from 'react';
import Link from 'next/link';
import ThemeSwich from './ThemeSwich';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '@/redux/features/user';
import Image from 'next/image';

export default function Navigation() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  return (
    <nav className='flex h-14 items-center justify-between px-2'>
      <div className=' relative h-14  w-16'>
        <Image
          sizes='(max-width: 640px) 100vw, 640px'
          style={{
            cursor: 'pointer',
            objectFit: 'contain',
            objectPosition: 'left',
          }}
          src='/logo.png'
          alt='Picture of the logo'
          fill
        />
      </div>

      <div className='flex items-center  gap-1'>
        <span className=' text-2xl'>
          <Icon icon='heroicons:sun-20-solid' />
        </span>
        <ThemeSwich />

        <span className=' text-2xl'>
          <Icon icon='heroicons-solid:moon' />
        </span>

        <div>
          {user.token ? (
            <Link
              onClick={() => {
                dispatch(clearUser());
              }}
              href='/'
            >
              <span className=' text-2xl'>
                <Icon icon='solar:logout-bold-duotone' />
              </span>
            </Link>
          ) : (
            <span className=' text-2xl'></span>
          )}
        </div>
      </div>
    </nav>
  );
}
