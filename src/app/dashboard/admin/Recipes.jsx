import React, { useState, useEffect } from 'react';
import {
  getRecipeList,
  getRecipeListBySearch,
} from '@/redux/features/recipeList';
import { SearchIcon } from '@heroicons/react/solid';
import { useDispatch, useSelector } from 'react-redux';
import {
  getRecipeById,
  updateRecipeById,
  deleteRecipeById,
  createNewRecipe,
} from '@/redux/features/recipe';
import {
  getCombinationsList,
  getCombinationsListBySearch,
} from '@/redux/features/combinationList';

import { getCombinationabyrecipeId } from '@/redux/features/combination_recipe';

import { Card, Button, Textarea, TextInput, Text, Title } from '@tremor/react';

import { Icon } from '@iconify/react';

export default function Recipes(props) {
  const dispatch = useDispatch();
  const combinationList = useSelector(
    (state) => state.combinationRoot.combinationList
  );

  const selectedCombination = useSelector(
    (state) => state.combinationRoot.combination_recipe
  );

  const user = useSelector((state) => state.user);
  const recipeList = useSelector((state) => state.recipeRoot.recipeList);
  const recipe = useSelector((state) => state.recipeRoot.recipe);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState('');
  const [recipeId, setRecipeId] = useState('');
  const [editRecipe, setEditRecipe] = useState(false);
  const [editRecipeData, setEditRecipeData] = useState({});
  const [deleteRecipe, setDeleteRecipe] = useState(false);
  const [createRecipe, setCreateRecipe] = useState(false);
  const [createRecipeData, setCreateRecipeData] = useState({});
  const [udatedCombination, setUpdatedCombination] = useState([]);
  const [addedCombination, setAddedCombination] = useState([]);
  const [removedCombination, setRemovedCombination] = useState([]);
  const [combinationPage, setCombinationPage] = useState(1);
  const [combinationSearch, setCombinationSearch] = useState('');

  useEffect(() => {
    dispatch(
      getRecipeList({
        page: props.page,
        token: user.token,
      })
    );
    setRefresh(false);
  }, [props.page, dispatch, refresh]);

  useEffect(() => {
    dispatch(
      getCombinationsList({
        page: combinationPage,
        token: user.token,
      })
    );
  }, [combinationPage, dispatch, createRecipe, editRecipe]);

  const handleSearch = () => {
    if (search === '') {
      dispatch(getRecipeList({ page: props.page, token: user.token }));
    } else {
      dispatch(
        getRecipeListBySearch({
          page: props.page,
          token: user.token,
          search: search,
        })
      );
    }
  };

  const handleRecipeUpdate = async () => {
    dispatch(
      updateRecipeById({
        id: recipeId,
        token: user.token,
        data: {
          title: editRecipeData.title,
          instruction: editRecipeData.instruction,
          combination: {
            create: udatedCombination,
            update: [],
            delete: removedCombination,
          },
        },
      })
    );
    dispatch(
      getRecipeList({
        page: props.page,
        token: user.token,
      })
    );

    setRecipeId('');
    document.body.classList.remove('overflow-hidden');
    setEditRecipe(false);
  };

  const handelMakeRecipe = async () => {
    await dispatch(
      createNewRecipe({
        token: user.token,
        data: {
          title: createRecipeData.title,
          instruction: createRecipeData.instruction,
          combination: {
            create: udatedCombination,
            update: [],
            delete: [],
          },
        },
      })
    );

    await dispatch(
      getRecipeList({
        page: props.page,
        token: user.token,
      })
    );

    setCreateRecipe(false);
    document.body.classList.remove('overflow-hidden');
  };

  const recipeMakeStart = () => {
    setCreateRecipe(true);
    setCreateRecipeData({});
    setAddedCombination([]);
    setRemovedCombination([]);
    setUpdatedCombination([]);
    document.body.classList.add('overflow-hidden');
  };

  const editRecipeStart = async (id) => {
    setRecipeId(id);
    await dispatch(
      getCombinationabyrecipeId({
        id: id,
        token: user.token,
      })
    );

    await dispatch(
      getRecipeById({
        id: id,
        token: user.token,
      })
    );

    setRemovedCombination([]);
    setUpdatedCombination([]);

    setEditRecipe(true);

    document.body.classList.add('overflow-hidden');
  };

  useEffect(() => {
    if (recipe?.data) {
      setAddedCombination(
        selectedCombination.data.map((combination) => combination)
      );
    }
  }, [selectedCombination]);

  const handleCombinationSearch = () => {
    if (combinationSearch === '') {
      dispatch(
        getCombinationsList({ page: combinationPage, token: user.token })
      );
    } else {
      dispatch(
        getCombinationsListBySearch({
          page: combinationPage,
          token: user.token,
          search: combinationSearch,
        })
      );
    }
  };

  useEffect(() => {
    console.log('updatedCombination', udatedCombination);

    console.log('removedCombination', removedCombination);
  }, [udatedCombination, removedCombination]);

  return (
    <>
      {deleteRecipe && (
        <div className=' absolute left-0 top-0 z-10 grid h-full w-full items-center backdrop-blur-md'>
          <Card className='  m-auto w-full max-w-lg'>
            <div className=' flex w-full items-center justify-between'>
              <Title>Delete Recipe</Title>
              <Button
                onClick={() => {
                  setDeleteRecipe(false);
                  document.body.classList.remove('overflow-hidden');
                }}
              >
                Close
              </Button>
            </div>
            <div className='mt-4 flex flex-col gap-3'>
              <Title>Are you sure you want to delete this recipe?</Title>
            </div>
            <Button
              className=' mt-2 w-full'
              onClick={async () => {
                dispatch(
                  deleteRecipeById({
                    id: recipeId,
                    token: user.token,
                  })
                );
                dispatch(
                  getRecipeList({
                    page: props.page,
                    token: user.token,
                  })
                );
                setDeleteRecipe(false);
                document.body.classList.remove('overflow-hidden');
              }}
            >
              Delete
            </Button>
          </Card>
        </div>
      )}

      {createRecipe && (
        <div className=' absolute left-0 top-0 z-10 h-full w-full bg-tremor-background-muted p-3 dark:bg-dark-tremor-brand-faint'>
          <Card className=' h-full w-full'>
            <div className=' flex w-full items-center justify-between'>
              <Title>New Recipe</Title>
              <Button
                onClick={() => {
                  setCreateRecipe(false);
                  document.body.classList.remove('overflow-hidden');
                }}
              >
                Close
              </Button>
            </div>
            <div className='mt-4 flex flex-col gap-3'>
              <TextInput
                className='w-full'
                label='Title'
                onChange={(e) => {
                  setCreateRecipeData({
                    ...createRecipeData,
                    title: e.target.value,
                  });
                }}
                placeholder='Title'
              />
              <Textarea
                className='w-full'
                label='Instruction'
                onChange={(e) => {
                  setCreateRecipeData({
                    ...createRecipeData,
                    instruction: e.target.value,
                  });
                }}
                placeholder='Instruction'
              />
            </div>
            <div>
              <Title className=' mt-2'>Combination</Title>
              <div className=' mt-2 flex flex-wrap  gap-2'>
                {addedCombination.map(
                  (combination) => (
                    console.log('combination', combination),
                    (
                      <Card
                        className=' w-fit p-3'
                        onClick={() => {
                          setAddedCombination(
                            addedCombination.filter(
                              (addedCombination) =>
                                addedCombination.combination_id.id !==
                                combination.combination_id.id
                            )
                          );
                          if (
                            selectedCombination.data
                              .map(
                                (selectedCombination) =>
                                  selectedCombination &&
                                  selectedCombination.combination_id &&
                                  selectedCombination.combination_id.id
                              )
                              .includes(combination.combination_id.id)
                          ) {
                            setRemovedCombination([
                              ...removedCombination,
                              combination.id,
                            ]);
                          }
                          setUpdatedCombination(
                            udatedCombination.filter(
                              (updatedCombination) =>
                                updatedCombination.combination_id.id !==
                                combination.combination_id.id
                            )
                          );
                        }}
                        key={combination.combination_id.id}
                      >
                        <Title>{combination.combination_id.title}</Title>
                      </Card>
                    )
                  )
                )}
              </div>
              <hr className=' mt-4' />
              <Title className=' mb-2 mt-4'>Add Combination</Title>
              <div className=' mt-3 flex  w-full gap-1 '>
                <TextInput
                  icon={SearchIcon}
                  onChange={(e) => {
                    setCombinationSearch(e.target.value);
                  }}
                  placeholder='Search...'
                />
                <Button
                  onClick={handleCombinationSearch}
                  size='xs'
                  variant='primary'
                >
                  Search
                </Button>
                <Button
                  onClick={() => {
                    dispatch(
                      getCombinationsList({ page: 1, token: user.token })
                    );
                  }}
                  size='xs'
                  variant='primary'
                >
                  Reset
                </Button>
              </div>
              <div className='mt-2 flex flex-wrap  gap-1'>
                {combinationList?.data
                  .filter(
                    (combination) =>
                      !addedCombination
                        .map(
                          (addedCombination) =>
                            addedCombination.combination_id.id
                        )
                        .includes(combination.id)
                  )
                  .map((combination) => (
                    <Card
                      className=' w-fit p-3'
                      onClick={() => {
                        setAddedCombination([
                          ...addedCombination,
                          {
                            id: recipeId,
                            combination_id: {
                              id: combination.id,
                              title: combination.title,
                            },
                          },
                        ]);

                        if (
                          !selectedCombination?.data
                            .map(
                              (selectedCombination) =>
                                selectedCombination &&
                                selectedCombination.combination_id &&
                                selectedCombination.combination_id.id
                            )
                            .includes(combination.id)
                        ) {
                          setUpdatedCombination([
                            ...udatedCombination,
                            {
                              recipe_id: '+',
                              combination_id: {
                                id: combination.id,
                              },
                            },
                          ]);
                        }
                        setRemovedCombination(
                          removedCombination.filter(
                            (removedCombination) =>
                              removedCombination.combination_id.id !==
                              combination.id
                          )
                        );
                      }}
                      key={combination.id}
                    >
                      <Title>{combination.title}</Title>
                    </Card>
                  ))}
              </div>
            </div>
            <Button className=' mt-2 w-full' onClick={handelMakeRecipe}>
              Create
            </Button>
          </Card>
        </div>
      )}

      {editRecipe && (
        <div className=' absolute left-0 top-0 z-10 h-full w-full bg-tremor-background-muted p-3 dark:bg-dark-tremor-brand-faint'>
          <Card className=' h-full w-full overflow-y-auto'>
            <div className=' flex w-full items-center justify-between'>
              <Title>{recipe.data.title}</Title>
              <Button
                onClick={async () => {
                  setEditRecipe(false);
                  document.body.classList.remove('overflow-hidden');
                  setAddedCombination([]);
                  setRemovedCombination([]);
                  setUpdatedCombination([]);
                  setRecipeId('');
                }}
              >
                Close
              </Button>
            </div>
            <div className='mt-4 flex flex-col gap-3'>
              <TextInput
                className='w-full'
                label='Title'
                onChange={(e) => {
                  setEditRecipeData({
                    ...editRecipeData,
                    title: e.target.value,
                  });
                }}
                placeholder='Title'
                defaultValue={recipe.data.title}
              />
              <Textarea
                className='  h-60 w-full resize-none'
                label='Instruction'
                onChange={(e) => {
                  setEditRecipeData({
                    ...editRecipeData,
                    instruction: e.target.value,
                  });
                }}
                placeholder='Instruction'
                defaultValue={
                  recipe.data.instruction === null
                    ? ''
                    : recipe.data.instruction
                }
              />
            </div>
            <div>
              <Title className=' mt-2'>Combination</Title>
              <div className=' mt-2 flex flex-wrap  gap-2'>
                {addedCombination.map(
                  (combination) => (
                    console.log('combination', combination),
                    (
                      <Card
                        className=' w-fit p-3'
                        onClick={() => {
                          setAddedCombination(
                            addedCombination.filter(
                              (addedCombination) =>
                                addedCombination.combination_id.id !==
                                combination.combination_id.id
                            )
                          );
                          if (
                            selectedCombination.data
                              .map(
                                (selectedCombination) =>
                                  selectedCombination.combination_id.id
                              )
                              .includes(combination.combination_id.id)
                          ) {
                            setRemovedCombination([
                              ...removedCombination,
                              combination.id,
                            ]);
                          }
                          setUpdatedCombination(
                            udatedCombination.filter(
                              (updatedCombination) =>
                                updatedCombination.combination_id.id !==
                                combination.combination_id.id
                            )
                          );
                        }}
                        key={combination.combination_id.id}
                      >
                        <Title>{combination.combination_id.title}</Title>
                      </Card>
                    )
                  )
                )}
              </div>
              <hr className=' mt-4' />

              <Title className=' mb-2 mt-4'>Add Combination</Title>
              <div className=' mt-3 flex  w-full gap-1 '>
                <TextInput
                  icon={SearchIcon}
                  onChange={(e) => {
                    setCombinationSearch(e.target.value);
                  }}
                  placeholder='Search...'
                />
                <Button
                  onClick={handleCombinationSearch}
                  size='xs'
                  variant='primary'
                >
                  Search
                </Button>
                <Button
                  onClick={() => {
                    dispatch(
                      getCombinationsList({ page: 1, token: user.token })
                    );
                  }}
                  size='xs'
                  variant='primary'
                >
                  Reset
                </Button>
              </div>
              <div className='mt-2 flex flex-wrap  gap-1'>
                {combinationList?.data
                  .filter(
                    (combination) =>
                      !addedCombination
                        .map(
                          (addedCombination) =>
                            addedCombination.combination_id.id
                        )
                        .includes(combination.id)
                  )
                  .map((combination) => (
                    <Card
                      className=' w-fit p-3'
                      onClick={() => {
                        setAddedCombination([
                          ...addedCombination,
                          {
                            id: recipeId,
                            combination_id: {
                              id: combination.id,
                              title: combination.title,
                            },
                          },
                        ]);
                        // only add to updatedCombination if it is not already in the selectedCombination
                        if (
                          !selectedCombination.data
                            .map(
                              (selectedCombination) =>
                                selectedCombination.combination_id.id
                            )
                            .includes(combination.id)
                        ) {
                          setUpdatedCombination([
                            ...udatedCombination,
                            {
                              recipe_id: recipeId.toString(),
                              combination_id: {
                                id: combination.id,
                              },
                            },
                          ]);
                        }

                        setRemovedCombination(
                          removedCombination.filter(
                            (removedCombination) =>
                              removedCombination.combination_id.id !==
                              combination.id
                          )
                        );
                      }}
                      key={combination.id}
                    >
                      <Title>{combination.title}</Title>
                    </Card>
                  ))}
              </div>
            </div>
            <Button className=' mt-2 w-full' onClick={handleRecipeUpdate}>
              Update
            </Button>
          </Card>
        </div>
      )}

      <div className='px-3'>
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
            <Title>Recipes</Title>
          </div>
        </div>

        <Card className='mt-4'>
          <div className='flex flex-col flex-wrap  gap-1 md:flex-row md:items-center md:justify-between'>
            <div className=' flex w-full  gap-1 md:w-2/3'>
              <TextInput
                icon={SearchIcon}
                onChange={(e) => {
                  setSearch(e.target.value);
                  props.setPage(1);
                }}
                placeholder='Search...'
              />
              <Button onClick={handleSearch} size='xs' variant='primary'>
                Search
              </Button>
            </div>

            <Button
              onClick={() => {
                recipeMakeStart();
              }}
              size='xs'
              variant='primary'
            >
              New Recipe
            </Button>
          </div>
          <div className=' mt-2 grid grid-cols-1 gap-2  md:grid-cols-3'>
            {recipeList?.data.map((recipe) => (
              <Card
                key={recipe.id}
                className='flex flex-col justify-between gap-1'
              >
                <Title>{recipe.title}</Title>
                <Text className=' line-clamp-2 overflow-ellipsis   '>
                  {recipe?.instruction}
                </Text>
                <Button
                  onClick={() => {
                    editRecipeStart(recipe.id);
                  }}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    setDeleteRecipe(true);
                    setRecipeId(recipe.id);
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
                if (props.page > 1) {
                  props.setPage(props.page - 1);
                }
              }}
              size='xs'
              variant='secondary'
            >
              Previous
            </Button>
            <div className='text-lg text-tremor-brand-emphasis  dark:text-dark-tremor-brand-emphasis'>
              Page - {props.page}
            </div>
            <Button
              onClick={() => {
                if (recipeList?.data.length >= 9) {
                  props.setPage(props.page + 1);
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
