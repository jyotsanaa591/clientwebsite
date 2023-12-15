'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Clients from './clients';
import Recipes from './Recipes';
import Combination from './Combination';
import { getRecipeList } from '@/redux/features/recipeList';
import { getCombinationsList } from '@/redux/features/combinationList';
import { getClients } from '@/redux/features/clientsList';
import { useDispatch, useSelector } from 'react-redux';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@tremor/react';

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const recipeList = useSelector((state) => state.recipeRoot.recipeList);
  const combinationList = useSelector(
    (state) => state.combinationRoot.combinationList
  );
  const clientsList = useSelector((state) => state.clientRoot.clientsList);

  useEffect(() => {
    if (
      !user.token ||
      user.data.role !== '105fbd5c-8423-4cd4-851a-6f3a95cab70f'
    ) {
      router.push('/');
    }
  }, []);

  const [Clientpage, ClientsetPage] = React.useState(1);
  const [Recipepage, RecipesetPage] = React.useState(1);
  const [Combinationpage, CombinationsetPage] = React.useState(1);

  return (
    <>
      <h1 className=' text-3xl  font-bold'>Admin Pannel</h1>
      <TabGroup>
        <TabList variant='solid' className='mt-1 flex w-full  p-1'>
          <Tab
            onClick={() => {
              dispatch(
                getClients({
                  page: 1,
                  token: user.token,
                })
              );
              ClientsetPage(1);
            }}
          >
            Clients
          </Tab>
          <Tab
            onClick={() => {
              dispatch(
                getRecipeList({
                  page: 1,
                  token: user.token,
                })
              );
              RecipesetPage(1);
            }}
          >
            Recipes
          </Tab>
          <Tab
            onClick={() => {
              dispatch(
                getCombinationsList({
                  page: 1,
                  token: user.token,
                })
              );
              CombinationsetPage(1);
            }}
          >
            Combinations
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div>
              <Clients page={Clientpage} setPage={ClientsetPage} />
            </div>
          </TabPanel>
          <TabPanel>
            <div>
              <Recipes page={Recipepage} setPage={RecipesetPage} />
            </div>
          </TabPanel>
          <TabPanel>
            <div>
              <Combination
                page={Combinationpage}
                setPage={CombinationsetPage}
              />
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </>
  );
}
