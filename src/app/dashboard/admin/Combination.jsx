import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchIcon } from '@heroicons/react/solid';
import { Card, Button, TextInput, Title } from '@tremor/react';
import { Icon } from '@iconify/react';
import {
  getCombinationsList,
  getCombinationsListBySearch,
} from '@/redux/features/combinationList';
import {
  makeCombinationByid,
  deleteCombinationByid,
  updateCombinationByid,
  getCombinationById,
} from '@/redux/features/combination';

export default function Combination() {
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const combination = useSelector((state) => state.combinationRoot.combination);
  const combinationList = useSelector(
    (state) => state.combinationRoot.combinationList
  );

  const recipe = useSelector((state) => state.recipeRoot.recipe);
  const recipeList = useSelector((state) => state.recipeRoot.recipeList);

  const [search, setSearch] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [newCombination, setNewCombination] = useState(false);
  const [newCombinationData, setNewCombinationData] = useState({});
  const [error, setError] = useState(false);
  const [updateCombination, setUpdateCombination] = useState(false);
  const [updateCombinationData, setUpdateCombinationData] = useState({});
  const [deleteCombination, setDeleteCombination] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [editId, setEditId] = useState('');

  useEffect(() => {
    dispatch(getCombinationsList({ page: page, token: user.token }));
    setRefresh(false);
  }, [page, refresh]);

  const handleSearch = () => {
    if (search === '') {
      dispatch(getCombinationsList({ page: page, token: user.token }));
    } else {
      dispatch(
        getCombinationsListBySearch({
          page: page,
          token: user.token,
          search: search,
        })
      );
    }
  };

  const handleDelete = async (id) => {
    await dispatch(deleteCombinationByid({ token: user.token, id: id }));
    dispatch(getCombinationsList({ page: page, token: user.token }));
    document.body.classList.remove('overflow-hidden');
    setDeleteCombination(false);
  };

  const handelEdit = async (id) => {
    document.body.classList.add('overflow-hidden');
    setEditId(id);
    await dispatch(getCombinationById({ token: user.token, id: id }));

    setUpdateCombination(true);
  };

  const hadelEditCobination = async () => {
    await dispatch(
      updateCombinationByid({
        token: user.token,
        data: updateCombinationData,
        id: editId,
      })
    );
    dispatch(getCombinationsList({ page: page, token: user.token }));
    document.body.classList.remove('overflow-hidden');
    setUpdateCombination(false);
  };

  const handleNewCombination = async () => {
    if (!newCombinationData.title) {
      setError(true);
      return;
    } else {
      await dispatch(
        makeCombinationByid({
          token: user.token,
          data: newCombinationData,
        })
      );

      dispatch(getCombinationsList({ page: page, token: user.token }));
      document.body.classList.remove('overflow-hidden');
      setNewCombination(false);
    }
  };

  return (
    <>
      {newCombination && (
        <div className=' absolute left-0 top-0 z-10 grid h-full w-full items-center  backdrop-blur-md '>
          <Card className=' m-auto w-3/4 max-w-lg'>
            <div className='flex w-full items-start justify-between'>
              <Title>New Combination</Title>
              <Button
                onClick={() => {
                  setNewCombination(false);
                  setNewCombinationData({});
                  document.body.classList.remove('overflow-hidden');
                }}
                variant='secondary'
                size='xs'
              >
                Close
              </Button>
            </div>
            <div className='mt-2 flex flex-col'>
              <TextInput
                placeholder='Title'
                onChange={(e) => {
                  setNewCombinationData({
                    ...newCombinationData,
                    title: e.target.value,
                  });
                }}
              />
              {
                <div className='  text-red-700 dark:text-red-500'>
                  {error && 'Please Fill All Fields'}
                </div>
              }
              <Button
                onClick={handleNewCombination}
                className='mt-2'
                variant='primary'
              >
                Make New Combination
              </Button>
            </div>
          </Card>
        </div>
      )}

      {updateCombination && (
        <div className=' absolute left-0 top-0 z-10 grid h-full w-full items-center  backdrop-blur-md '>
          <Card className=' m-auto w-3/4 max-w-lg'>
            <div className='flex w-full items-start justify-between'>
              <Title>{combination.data.title}</Title>
              <Button
                onClick={() => {
                  setUpdateCombination(false);
                  setEditId('');
                  document.body.classList.remove('overflow-hidden');
                }}
                variant='secondary'
                size='xs'
              >
                Close
              </Button>
            </div>
            <div className='mt-2 flex flex-col'>
              <TextInput
                placeholder='Title'
                defaultValue={combination.data.title}
                onChange={(e) => {
                  setUpdateCombinationData({
                    ...updateCombinationData,
                    title: e.target.value,
                  });
                }}
              />

              <Button
                onClick={hadelEditCobination}
                className='mt-2'
                variant='primary'
              >
                edit Combination
              </Button>
            </div>
          </Card>
        </div>
      )}

      {deleteCombination && (
        <div className=' absolute left-0 top-0 z-10 grid h-full w-full items-center  backdrop-blur-md '>
          <Card className=' m-auto w-3/4 max-w-lg'>
            <div className='flex w-full items-start justify-between'>
              <Title>Do you want to delete this combination ?</Title>
              <Button
                onClick={() => {
                  setDeleteCombination(false);
                  setDeleteId('');
                  document.body.classList.remove('overflow-hidden');
                }}
                variant='secondary'
                size='xs'
              >
                Close
              </Button>
            </div>
            <div className='mt-2 flex w-full gap-2 '>
              <Button
                onClick={() => {
                  setDeleteCombination(false);
                  setDeleteId('');
                  document.body.classList.remove('overflow-hidden');
                }}
                className='mt-2'
                variant='primary'
              >
                No
              </Button>
              <Button
                onClick={() => handleDelete(deleteId)}
                className='mt-2'
                variant='primary'
              >
                Yes
              </Button>
            </div>
          </Card>
        </div>
      )}

      <div className=' px-3'>
        <div className='flex'>
          <div className='flex gap-2 '>
            <Button
              className=' text-base'
              size='xs'
              variant='secondary'
              onClick={() => setRefresh(true)}
            >
              <Icon icon='material-symbols:refresh' />
            </Button>
            <Title>Combination</Title>
          </div>
        </div>
        <Card className='mt-4'>
          <div className='flex flex-col flex-wrap  gap-1 md:flex-row md:items-center md:justify-between'>
            <div className=' flex w-full  gap-1 md:w-2/3'>
              <TextInput
                icon={SearchIcon}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder='Search...'
              />
              <Button onClick={handleSearch} size='xs' variant='primary'>
                Search
              </Button>
            </div>

            <Button
              onClick={() => {
                setNewCombination(true);
                setNewCombinationData({});
                document.body.classList.add('overflow-hidden');
              }}
              size='xs'
              variant='primary'
            >
              New Combination
            </Button>
          </div>
          <div className=' mt-2 grid grid-cols-1 gap-2  md:grid-cols-3'>
            {combinationList?.data.map((combination) => (
              <Card key={combination.id} className='flex flex-col gap-1'>
                <Title>{combination.title}</Title>
                <Button
                  onClick={() => {
                    setUpdateCombination(true);
                    handelEdit(combination.id);
                    document.body.classList.add('overflow-hidden');
                  }}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    setDeleteCombination(true);
                    setDeleteId(combination.id);
                    document.body.classList.add('overflow-hidden');
                  }}
                >
                  Delete
                </Button>
              </Card>
            ))}
          </div>
          <div className=' mt-3 flex justify-center gap-4'>
            <Button
              onClick={() => {
                if (page > 1) {
                  setPage(page - 1);
                }
              }}
              size='xs'
              variant='secondary'
            >
              Previous
            </Button>
            <div className='text-lg text-tremor-brand-emphasis  dark:text-dark-tremor-brand-emphasis'>
              Page - {page}
            </div>
            <Button
              onClick={() => {
                if (combinationList?.data.length >= 9) {
                  setPage(page + 1);
                }
              }}
              size='xs'
              variant='secondary'
            >
              Next
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
