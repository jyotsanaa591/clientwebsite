// 'use client';
// import React, { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Clients from './clients';
// import Recipes from './Recipes';
// import Combination from './Combination';
// import { getRecipeList } from '@/redux/features/recipeList';
// import { getCombinationsList } from '@/redux/features/combinationList';
// import { getClients } from '@/redux/features/clientsList';
// import { useDispatch, useSelector } from 'react-redux';
// import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@tremor/react';

// export default function Page() {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.user);
//   const recipeList = useSelector((state) => state.recipeRoot.recipeList);
//   const combinationList = useSelector(
//     (state) => state.combinationRoot.combinationList
//   );
//   const clientsList = useSelector((state) => state.clientRoot.clientsList);

//   // useEffect(() => {
//   //   if (
//   //     !user.token ||
//   //     user.data.role !== '105fbd5c-8423-4cd4-851a-6f3a95cab70f'
//   //   ) {
//   //     router.push('/');
//   //   }
//   // }, []);
//   useEffect(() => {
//   const handleRedirect = async () => {
//     if (!user.token) return;

//     try {
//       const res = await dispatch(userVerify({ token: user.token }));
//       const roleId = res?.payload?.data?.role;

//       console.log("🧩 Logged-in Role UUID:", roleId);

//       // Map role UUIDs to dashboards
//       if (roleId === "105fbd5c-8423-4cd4-851a-6f3a95cab70f" || roleId === "7fa6c95a-2a73-4a8f-85f9-408ffe87e23f") {
//         router.push("/dashboard/admin"); // admin + viewer
//       } 
//       else if (roleId === "0ce3fcd3-92a1-453d-8067-8308d5c372ad") {
//         router.push("/dashboard/user"); // normal user
//       } 
//       else {
//         router.push("/");
//       }
//     } catch (err) {
//       console.error("Role check failed:", err);
//       router.push("/");
//     }
//   };

//   handleRedirect();
// }, [user.token, router]);

//   const [Clientpage, ClientsetPage] = React.useState(1);
//   const [Recipepage, RecipesetPage] = React.useState(1);
//   const [Combinationpage, CombinationsetPage] = React.useState(1);

//   return (
//     <>
//       <h1 className=' text-3xl  font-bold'>Admin Pannel</h1>
//       <TabGroup>
//         <TabList variant='solid' className='mt-1 flex w-full  p-1'>
//           <Tab
//             onClick={() => {
//               dispatch(
//                 getClients({
//                   page: 1,
//                   token: user.token,
//                 })
//               );
//               ClientsetPage(1);
//             }}
//           >
//             Clients
//           </Tab>
//           <Tab
//             onClick={() => {
//               dispatch(
//                 getRecipeList({
//                   page: 1,
//                   token: user.token,
//                 })
//               );
//               RecipesetPage(1);
//             }}
//           >
//             Recipes
//           </Tab>
//           <Tab
//             onClick={() => {
//               dispatch(
//                 getCombinationsList({
//                   page: 1,
//                   token: user.token,
//                 })
//               );
//               CombinationsetPage(1);
//             }}
//           >
//             Combinations
//           </Tab>
//         </TabList>
//         <TabPanels>
//           <TabPanel>
//             <div>
//               <Clients page={Clientpage} setPage={ClientsetPage} />
//             </div>
//           </TabPanel>
//           <TabPanel>
//             <div>
//               <Recipes page={Recipepage} setPage={RecipesetPage} />
//             </div>
//           </TabPanel>
//           <TabPanel>
//             <div>
//               <Combination
//                 page={Combinationpage}
//                 setPage={CombinationsetPage}
//               />
//             </div>
//           </TabPanel>
//         </TabPanels>
//       </TabGroup>
//     </>
//   );
// }



'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { userVerify } from '@/redux/features/user'; // ✅ MISSING IMPORT
import Clients from './clients';
import Recipes from './Recipes';
import Combination from './Combination';
import { getRecipeList } from '@/redux/features/recipeList';
import { getCombinationsList } from '@/redux/features/combinationList';
import { getClients } from '@/redux/features/clientsList';
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@tremor/react';

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [Clientpage, ClientsetPage] = useState(1);
  const [Recipepage, RecipesetPage] = useState(1);
  const [Combinationpage, CombinationsetPage] = useState(1);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user.token) {
        router.push('/');
        return;
      }

      try {
        const res = await dispatch(userVerify({ token: user.token }));
        const roleId = res?.payload?.data?.role;
        console.log('Logged-in Role UUID:', roleId);

        //  Access control logic:
        if (roleId === '105fbd5c-8423-4cd4-851a-6f3a95cab70f' || roleId === '7fa6c95a-2a73-4a8f-85f9-408ffe87e23f') {
          // admin or viewer → stay here 
          console.log('Access granted: Admin/Viewer');
        } else if (roleId === '0ce3fcd3-92a1-453d-8067-8308d5c372ad') {
          // user → redirect to user dashboard
          router.push('/dashboard/user');
        } else {
          router.push('/');
        }
      } catch (err) {
        console.error('Role check failed:', err);
        router.push('/');
      }
    };

    checkAccess();
  }, [user.token, router, dispatch]);

  return (
    <>
      <h1 className='text-3xl font-bold mb-4'>Admin Panel</h1>

      <TabGroup>
        <TabList variant='solid' className='mt-1 flex w-full p-1'>
          <Tab
            onClick={() => {
              dispatch(getClients({ page: 1, token: user.token }));
              ClientsetPage(1);
            }}
          >
            Clients
          </Tab>
          <Tab
            onClick={() => {
              dispatch(getRecipeList({ page: 1, token: user.token }));
              RecipesetPage(1);
            }}
          >
            Recipes
          </Tab>
          <Tab
            onClick={() => {
              dispatch(getCombinationsList({ page: 1, token: user.token }));
              CombinationsetPage(1);
            }}
          >
            Combinations
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Clients page={Clientpage} setPage={ClientsetPage} />
          </TabPanel>
          <TabPanel>
            <Recipes page={Recipepage} setPage={RecipesetPage} />
          </TabPanel>
          <TabPanel>
            <Combination page={Combinationpage} setPage={CombinationsetPage} />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </>
  );
}