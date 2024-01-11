'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin, userVerify } from '@/redux/features/user';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Hero from './hero.jpg';
import { Card, TextInput, Title, Button } from '@tremor/react';

export default function Home() {
  const dispatch = useDispatch();

  const router = useRouter();

  const user = useSelector((state) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handelLogin = async () => {
    try {
      const res = await dispatch(
        userLogin({
          email: email,
          password: password,
        })
      );

      if (res.error) {
        setError(true);
        //get response from server
        console.log(res.error.response);
      }
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    const handleRedirect = async () => {
      if (user.token) {
        await dispatch(userVerify({ token: user.token }));
        if (user.data.role === '105fbd5c-8423-4cd4-851a-6f3a95cab70f') {
          router.push('/dashboard/admin');
        } else {
          router.push('/dashboard/user');
        }
      }
    };

    handleRedirect();
  }, [user.token, user.data.role, router, dispatch]);

  return (
    <div className=' flex h-[calc(100vh-3.5rem)] flex-row-reverse overflow-hidden '>
      <div className=' bg-tremor-background-DEFAULT dark:bg-dark-tremor-background-DEFAULT grid h-full w-full items-center md:w-2/5'>
        <Card
          className='mx-auto flex  h-fit max-w-lg flex-col items-end gap-2.5'
          decorationColor='indigo'
        >
          <Title className=' w-full text-left'>Login</Title>
          <TextInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Type Email'
            type='email'
          ></TextInput>
          <TextInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Type password '
            type='password'
          ></TextInput>
          {error && (
            <div className='text-sm text-red-500'>
              Invalid Credentials or account suspended
            </div>
          )}
          <Button
            size='md'
            onClick={() => {
              handelLogin();
            }}
          >
            <div className='flex items-center gap-2'>
              Submit
              <Icon icon='formkit:arrowright'></Icon>
            </div>
          </Button>
        </Card>
      </div>
      <div className='  hidden  h-[calc(100vh-3.5rem)] w-3/5 p-5 md:block'>
        <div className=' w-ful relative h-full  '>
          <Image
            sizes='(max-width: 640px) 100vw, 640px'
            alt='Picture of the hero'
            className=' rounded-lg '
            style={{
              objectFit: 'cover',
            }}
            fill
            src={Hero}
          ></Image>
        </div>
      </div>
    </div>
  );
}

// const [directus, setDirectus] = useState(null);
// const [accessToken, setAccessToken] = useState(null);
// const [refreshToken, setRefreshToken] = useState(null);
// const login = async () => {
//   const directus = createDirectus('https://admin.iluvme.in').with(
//     authentication('json')
//   );
//   const response = await directus.login(email, password);
//   setDirectus(directus);
//   setAccessToken(response.access_token);
// };
