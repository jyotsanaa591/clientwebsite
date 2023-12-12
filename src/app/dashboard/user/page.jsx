'use client';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  if (!user.token) {
    router.push('/');
  }

  return (
    <>
      <div>User</div>
    </>
  );
}
