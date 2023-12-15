'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

import { getClients, getClientsBySearch } from '@/redux/features/clientsList';
import {
  makeClient,
  updateClient,
  getClientById,
  deleteClientByID,
} from '@/redux/features/clients';

import {
  getCombinationsList,
  getCombinationsListBySearch,
} from '@/redux/features/combinationList';

import { getRecipeByCombinationId } from '@/redux/features/combination_recipe';
import { makeSchedule } from '@/redux/features/schedule';
import {
  Select,
  DatePicker,
  SelectItem,
  Card,
  SearchSelect,
  Button,
  Table,
  TableBody,
  TableCell,
  NumberInput,
  TableHead,
  TableHeaderCell,
  TableRow,
  TextInput,
  Textarea,
  Text,
  Title,
} from '@tremor/react';

import { getScheduleByclientID } from '@/redux/features/scheduleList';

import { SearchIcon } from '@heroicons/react/solid';
import combination from '@/redux/features/combination';

export default function Schedule() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const client = useSelector((state) => state.clientRoot.clients);
  const schedule = useSelector((state) => state.scheduleRoot.schedule);
  const schedulelist = useSelector((state) => state.scheduleRoot.scheduleList);
  const combinationList = useSelector(
    (state) => state.combinationRoot.combinationList
  );
  const recipeList = useSelector(
    (state) => state.combinationRoot.combination_recipe
  );

  const [formData, setFormData] = useState({
    name: client.data.first_name + ' ' + client.data.last_name,
    initialWeight: client.data.initial_weight,
    currentWeight: '',
    initialAge: client.data.age,
    age: '',
    initilaHeight: client.data.height,
    diet: [
      {
        mealTime: '',
        foodItem: '',
      },
    ],
    notes: '',
  });
  const [newSchedule, setNewSchedule] = useState(false);
  const [addvalueFromList, setAddvalueFromList] = useState(false);
  const [search, setSearch] = useState('');
  const [searchRecipe, setSearchRecipe] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState('');
  const [textAreaValues, setTextAreaValues] = useState([]);
  const [selectedCombination, setSelectedCombination] = useState('');
  const [newScheduleData, setNewScheduleData] = useState({
    schedule: {},
    client_name: {
      create: [
        {
          schedule_id: '+',
          directus_users_id: {
            id: client.data.id,
          },
        },
      ],
      update: [],
      delete: [],
    },
    start: '',
    end: '',
  });

  useEffect(() => {
    if (search === '') {
      dispatch(getCombinationsList({ page: 1, token: user.token }));
    } else {
      dispatch(
        getCombinationsListBySearch({
          page: 1,
          token: user.token,
          search: search,
        })
      );
    }
  }, [search]);

  useEffect(() => {
    if (selectedCombination !== '') {
      dispatch(
        getRecipeByCombinationId({
          page: 1,
          search: '',
          token: user.token,
          id: selectedCombination,
        })
      );
    }
  }, [selectedCombination]);

  useEffect(() => {
    if (searchRecipe === '') {
      dispatch(
        getRecipeByCombinationId({
          page: 1,
          search: '',
          token: user.token,
          id: selectedCombination,
        })
      );
    } else {
      dispatch(
        getRecipeByCombinationId({
          page: 1,
          search: searchRecipe,
          token: user.token,
          id: selectedCombination,
        })
      );
    }
  }, [searchRecipe]);

  //form logic

  const handleMealChange = (e, index) => {
    const updatedDiet = [...formData.diet];
    updatedDiet[index][e.target.name] = e.target.value;
    setFormData({
      ...formData,
      diet: updatedDiet,
    });
  };

  const addMealToText = (index, item) => {
    const updatedTextAreaValues = [...textAreaValues];
    updatedTextAreaValues[index] =
      `Name : ${item.recipe_id.title} - \nInstruction : ${item.recipe_id.instruction}`;
    setTextAreaValues(updatedTextAreaValues);

    const fakeEvent = {
      target: {
        name: 'foodItem',
        value: item.recipe_id.title,
      },
    };

    handleMealChange(fakeEvent, index);
  };

  const addMeal = () => {
    setFormData({
      ...formData,
      diet: [...formData.diet, { mealTime: '', foodItem: '' }],
    });
  };

  const removeMeal = (index) => {
    const updatedDiet = [...formData.diet];
    updatedDiet.splice(index, 1);
    setFormData({
      ...formData,
      diet: updatedDiet,
    });
  };

  // form logic end

  const handelNewScheduleStart = () => {
    setNewSchedule(true);
    setNewScheduleData({
      schedule: {},
      client_name: {
        create: [
          {
            schedule_id: '+',
            directus_users_id: {
              id: client.data.id,
            },
          },
        ],
        update: [],
        delete: [],
      },
      start: '',
      end: '',
    });

    setFormData({
      name: client.data.first_name + ' ' + client.data.last_name,
      initialWeight: client.data.initial_weight,
      currentWeight: '',
      initialAge: client.data.age,
      age: '',
      initilaHeight: client.data.height,
      diet: [
        {
          mealTime: '',
          foodItem: '',
        },
      ],
      notes: '',
    });
    setSelectedCombination('');
    setTextAreaValues([]);
    setAddvalueFromList(false);

    document.body.style.overflow = 'hidden';
  };

  useEffect(() => {
    if (
      !user.token ||
      user.data.role !== '105fbd5c-8423-4cd4-851a-6f3a95cab70f'
    ) {
      router.push('/');
    }
  }, []);
  function formatDate(dateString) {
    // Parse the input date string
    const date = new Date(dateString);

    // Get the day, month, and year
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    // Array of month names
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    // Format the date as "DD Mon YYYY"
    const formattedDate = `${day} ${monthNames[monthIndex]} ${year}`;

    return formattedDate;
  }

  useEffect(() => {
    dispatch(
      getScheduleByclientID({
        page: 1,
        id: client.data.id,
        token: user.token,
      })
    );
  }, []);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handelNewSchedule = async () => {
    const updatedScheduleData = {
      ...newScheduleData,
      schedule: formData,
    };
    dispatch(
      makeSchedule({
        page: 1,
        token: user.token,
        data: updatedScheduleData,
      })
    );
    dispatch(
      getScheduleByclientID({
        page: 1,
        id: client.data.id,
        token: user.token,
      })
    );
    setNewSchedule(false);
    setSelectedCombination('');
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      {newSchedule && (
        <div className='absolute left-0 top-0 z-10 h-full w-full p-3 backdrop-blur-md'>
          <Card className=' h-full w-full  overflow-y-auto'>
            <div className=' flex w-full items-center justify-between'>
              <Title>New Schedule</Title>
              <Button
                onClick={() => {
                  setNewSchedule(false);
                  setSelectedCombination('');
                  document.body.style.overflow = 'auto';
                }}
              >
                Close
              </Button>
            </div>
            <div>
              <div className=' flex gap-2 '>
                <div className=' flex w-full flex-col gap-0.5'>
                  <span>Start Date</span>
                  <input
                    className=' h-10 rounded-md border  border-tremor-border bg-transparent p-2 dark:border-dark-tremor-border'
                    type='date'
                    onChange={(e) => {
                      setNewScheduleData({
                        ...newScheduleData,
                        start: e.target.value,
                      });
                    }}
                    placeholder='Start Date'
                  ></input>
                </div>
                <div className='flex w-full flex-col gap-0.5'>
                  <span>End Date</span>
                  <input
                    className=' h-10 rounded-md border  border-tremor-border bg-transparent p-2 dark:border-dark-tremor-border'
                    type='date'
                    onChange={(e) => {
                      setNewScheduleData({
                        ...newScheduleData,
                        end: e.target.value,
                      });
                    }}
                    placeholder='End Date'
                  ></input>
                </div>
              </div>
            </div>

            <div>
              <NumberInput
                placeholder='current weight'
                onChange={(e) => {
                  // Log the new value
                  setFormData({
                    ...formData,
                    currentWeight: e.target.value,
                  });
                }}
              />
              <NumberInput
                placeholder='current Age'
                onChange={(e) => {
                  // Log the new value
                  setFormData({
                    ...formData,
                    age: e.target.value,
                  });
                }}
              />
            </div>

            {formData.diet.map((meal, index) => (
              <Card className=' flex flex-col' key={index}>
                <div className=' my-1 flex w-full items-center justify-between'>
                  <Title>Meal {index + 1}</Title>

                  {
                    // only show remove button if there is more than 1 meal
                    formData.diet.length > 1 && (
                      <Button size='xs' onClick={() => removeMeal(index)}>
                        Remove Meal
                      </Button>
                    )
                  }
                </div>

                <input
                  className=' h-10 rounded-md border  border-tremor-border bg-transparent p-2 dark:border-dark-tremor-border'
                  type='time'
                  name='mealTime'
                  value={meal.mealTime}
                  onChange={(e) => handleMealChange(e, index)}
                />

                {!textAreaValues[index] && (
                  <Button
                    className=' my-2 w-28'
                    onClick={() => {
                      setAddvalueFromList(!addvalueFromList);
                      setSelectedCombination('');
                      document.body.style.overflow = 'hidden';
                    }}
                  >
                    Search Recipe
                  </Button>
                )}

                {addvalueFromList && (
                  <Card className=' fixed left-0 top-0 z-30 h-[100vh] w-[100vw]'>
                    <Button
                      onClick={() => {
                        setAddvalueFromList(false);
                        document.body.style.overflow = 'auto';
                      }}
                    >
                      Close
                    </Button>
                    {selectedCombination === '' && (
                      <div>
                        <TextInput
                          type='search'
                          className=' mt-3'
                          placeholder='Search Combination'
                          onChange={(e) => {
                            setSearch(e.target.value);
                          }}
                        ></TextInput>
                        <div className='mt-2 flex flex-wrap gap-2'>
                          {combinationList.data.map((item) => {
                            return (
                              <Card
                                className=' w-fit cursor-pointer'
                                onClick={() => {
                                  setSelectedCombination(item.id);
                                }}
                                key={item.id}
                              >
                                {item.title}
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {selectedCombination !== '' && (
                      <div>
                        <TextInput
                          type='search'
                          className=' mt-3'
                          placeholder='Search Recipe'
                          onChange={(e) => {
                            setSearchRecipe(e.target.value);
                          }}
                        ></TextInput>

                        {recipeList.data.length > 0 && (
                          <div className='mt-2 flex flex-wrap gap-2'>
                            {recipeList.data.map((item) => {
                              return (
                                <Card
                                  className=' w-fit cursor-pointer'
                                  onClick={() => {
                                    addMealToText(index, item);

                                    setAddvalueFromList(false);
                                  }}
                                  key={item.id}
                                >
                                  {item?.recipe_id && item.recipe_id.title}
                                </Card>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                )}
                <Textarea
                  name='foodItem'
                  className=' h-24'
                  value={textAreaValues[index] || ''}
                  onChange={(e) => {
                    const newTextAreaValues = [...textAreaValues];
                    newTextAreaValues[index] = e.target.value;
                    setTextAreaValues(newTextAreaValues);
                    handleMealChange(e, index);
                  }}
                />
              </Card>
            ))}

            <Button className=' mt-2' onClick={addMeal}>
              Add Meal
            </Button>

            <Textarea
              className=' mt-2'
              placeholder='Notes'
              onChange={(e) => {
                setFormData({
                  ...formData,
                  notes: e.target.value,
                });
              }}
            />

            <Button
              className=' mt-2'
              onClick={() => {
                handelNewSchedule();
              }}
            >
              Make Schedule
            </Button>
          </Card>
        </div>
      )}

      <div className=' p-3'>
        <div className=' flex items-center justify-between'>
          <div>
            <Title>
              {client.data.first_name} {client.data.last_name}
            </Title>
            <Text>{client.data.email}</Text>
          </div>
          <div>
            <Button
              onClick={() => {
                handelNewScheduleStart();
              }}
            >
              New Schedule
            </Button>
          </div>
        </div>

        <Card className=' mt-3'>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Index</TableHeaderCell>
                <TableHeaderCell>From Date</TableHeaderCell>
                <TableHeaderCell>End Date</TableHeaderCell>
                <TableHeaderCell>View</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedulelist.data?.map((item, Index) => (
                <TableRow key={item.id}>
                  <TableCell>{Index + 1}</TableCell>
                  <TableCell>
                    {item.schedule_id && formatDate(item.schedule_id.start)}
                  </TableCell>
                  <TableCell>
                    {item.schedule_id && formatDate(item.schedule_id.end)}
                  </TableCell>
                  <TableCell className=' cursor-pointer '>View</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </>
  );
}

function ViewSchedule() {
  return (
    <div>
      <div>d</div>
    </div>
  );
}
