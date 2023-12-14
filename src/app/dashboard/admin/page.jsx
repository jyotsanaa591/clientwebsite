'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Clients from './clients';
import Combination from './Combination';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@tremor/react';

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (
      !user.token ||
      user.data.role !== '105fbd5c-8423-4cd4-851a-6f3a95cab70f'
    ) {
      router.push('/');
    }
  }, []);

  return (
    <>
      <h1 className=' text-3xl  font-bold'>Admin Pannel</h1>
      <TabGroup>
        <TabList variant='solid' className='mt-1 flex w-full  p-1'>
          <Tab>Clients</Tab>
          <Tab>Recipes</Tab>
          <Tab>Combinations</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div>
              <Clients />
            </div>
          </TabPanel>
          <TabPanel>
            <div>recipie</div>
          </TabPanel>
          <TabPanel>
            <div>
              <Combination />
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </>
  );
}
