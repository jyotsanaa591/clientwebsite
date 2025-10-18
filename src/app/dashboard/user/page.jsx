// 'use client';
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useRouter } from 'next/navigation';
// import Schedule from './schedule';

// export default function Page() {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.user);

//   useEffect(() => {
//     if (!user.token) {
//       router.push('/');
//     }
//   }, []);

//   return (
//     <>
//       <div>
//         <Schedule />
//       </div>
//     </>
//   );
// }



'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { userVerify } from '@/redux/features/user';
import Schedule from './schedule';

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifyAndRedirect = async () => {
      // Step 1: No token → go back to login
      if (!user.token) {
        router.push('/');
        return;
      }

      try {
        // Step 2: Verify the token
        const res = await dispatch(userVerify({ token: user.token }));
        const roleId = res?.payload?.data?.role;

        console.log(' User dashboard role:', roleId);

        // Step 3: Redirect if not a normal user
        if (roleId === '0ce3fcd3-92a1-453d-8067-8308d5c372ad') {
          // valid user → allow
          setIsVerified(true);
        } else {
          // not user → send back
          router.push('/');
        }
      } catch (err) {
        console.error('Verification failed:', err);
        router.push('/');
      }
    };

    verifyAndRedirect();
  }, [user.token, router, dispatch]);

  // Step 4: Render schedule only after verification
  if (!isVerified) {
    return (
      <div className='h-screen flex items-center justify-center text-lg'>
        Verifying your session...
      </div>
    );
  }

  return (
    <div>
      <Schedule />
    </div>
  );
}