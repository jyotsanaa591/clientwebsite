'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Schedule from './schedule';

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!user.token) {
      router.push('/');
    }
  }, []);

  return (
    <>
      <div>
        <Schedule />
      </div>
    </>
  );
}
