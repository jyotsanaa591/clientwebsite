'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
} from '@react-pdf/renderer';
import ThemeSwich from '@/app/ThemeSwich';

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
import { PDFExport } from '@progress/kendo-react-pdf';
import { getRecipeByCombinationId } from '@/redux/features/combination_recipe';
import {
  makeSchedule,
  getScheduleById,
  deleteScheduleById,
} from '@/redux/features/schedule';
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
  Title,
} from '@tremor/react';

import { getScheduleByclientID } from '@/redux/features/scheduleList';

import { SearchIcon } from '@heroicons/react/solid';
import combination from '@/redux/features/combination';

export default function Schedule() {
  const [viewSchedule, setViewSchedule] = useState(false);
  const [ViewNotes, setViewNotes] = useState(false);
  const [viewTable, setViewTable] = useState(false);
  const [viewMealHistory, setViewMealHistory] = useState(false);
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
    dob: client.data.dob,
    initialAge: client.data.age,
    age: '',
    initilaHeight: client.data.height,
    diet: [
      {
        mealTime: '',
        mealTitle: '',
        recipe: '',
      },
    ],
    notes: '',
  });
  const [newSchedule, setNewSchedule] = useState(false);
  const [addvalueFromList, setAddvalueFromList] = useState(false);
  const [search, setSearch] = useState('');
  const [searchRecipe, setSearchRecipe] = useState('');
  const [deleteSchedule, setDeleteSchedule] = useState(false);
  const [setDeleteid, setSetDeleteid] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState('');
  const [page, setPage] = useState(1);
  const [textAreaValues, setTextAreaValues] = useState([]);
  const [textInput, setTextInput] = useState([]);
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
    updatedTextAreaValues[index] = ` ${item.recipe_id.instruction}`;
    setTextAreaValues(updatedTextAreaValues);

    const fakeEvent = {
      target: {
        name: 'recipe',
        value: item.recipe_id.instruction,
      },
    };

    handleMealChange(fakeEvent, index);
  };

  const addMealToInput = (index, item) => {
    const updatedTextInput = [...textInput];
    updatedTextInput[index] = ` ${item.recipe_id.title}`;
    setTextInput(updatedTextInput);

    const fakeEvent = {
      target: {
        name: 'mealTitle',
        value: item.recipe_id.title,
      },
    };

    handleMealChange(fakeEvent, index);
  };

  const addMeal = () => {
    setFormData({
      ...formData,
      diet: [
        ...formData.diet,
        {
          mealTime: '',
          mealTitle: '',
          recipe: '',
        },
      ],
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
      dob: client.data.dob,
      initilaHeight: client.data.height,
      diet: [
        {
          mealTime: '',
          mealTitle: '',
          recipe: '',
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
        page: page,
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
        page: page,
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
              <NumberInput
                placeholder='current height'
                onChange={(e) => {
                  // Log the new value
                  setFormData({
                    ...formData,
                    currentHeight: e.target.value,
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
                                    addMealToInput(index, item);
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
                <TextInput
                  name='mealTitle'
                  defaultValue={textInput[index] || ''}
                  onChange={(e) => {
                    const newTextInput = [...textInput];
                    newTextInput[index] = e.target.value;
                    setTextInput(newTextInput);
                    handleMealChange(e, index);
                  }}
                />

                <Textarea
                  name='recipe'
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

      <div className=' flex gap-2 pl-1'>
        <Button
          onClick={() => {
            setViewNotes(true);
            document.body.style.overflow = 'hidden';
          }}
        >
          Notes
        </Button>
        <Button
          onClick={() => {
            setViewTable(true);
            document.body.style.overflow = 'hidden';
          }}
        >
          Table
        </Button>
        <Button
          onClick={() => {
            setViewMealHistory(true);
            document.body.style.overflow = 'hidden';
          }}
        >
          Meal History
        </Button>
      </div>

      <div className=' p-3'>
        <div className=' flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className=' flex gap-1'>
              <Button
                onClick={() => {
                  router.push('/dashboard/admin');
                }}
              >
                Back
              </Button>
              <Button
                variant='secondary'
                onClick={() => {
                  dispatch(
                    getScheduleByclientID({
                      page: page,
                      id: client.data.id,
                      token: user.token,
                    })
                  );
                }}
              >
                Refresh
              </Button>
            </div>
            <div>
              <Title>
                {client.data.first_name} {client.data.last_name}
              </Title>
              <Text>{client.data.email}</Text>
            </div>
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
                <TableHeaderCell>Delete</TableHeaderCell>
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
                  <TableCell
                    onClick={() => {
                      dispatch(
                        getScheduleById({ token: user.token, id: item.id })
                      );
                      setViewSchedule(true);
                      document.body.style.overflow = 'hidden';
                    }}
                    className=' cursor-pointer '
                  >
                    View
                  </TableCell>

                  <TableCell
                    onClick={() => {
                      setDeleteSchedule(true);
                      setSetDeleteid(item.id);
                      document.body.style.overflow = 'hidden';
                    }}
                    className=' cursor-pointer '
                  >
                    Delete
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                if (schedulelist?.data.length >= 9) {
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

      {deleteSchedule && (
        <div>
          <div className='absolute top-0 z-20 grid  h-full w-full items-center p-3 backdrop-blur-md'>
            <Card className=' m-auto  max-w-xl p-2'>
              <div className=' flex w-full items-center justify-between'>
                <Title>Delete Schedule</Title>
              </div>
              <div className='mt-2'>
                <Text>Are you sure you want to delete this schedule?</Text>
              </div>
              <div className='mt-2 flex w-full justify-between'>
                <Button
                  onClick={() => {
                    setDeleteSchedule(false);
                    document.body.style.overflow = 'auto';
                  }}
                >
                  No
                </Button>
                <Button
                  onClick={async () => {
                    dispatch(
                      deleteScheduleById({
                        token: user.token,
                        id: setDeleteid,
                      })
                    );
                    dispatch(
                      getScheduleByclientID({
                        page: 1,
                        id: client.data.id,
                        token: user.token,
                      })
                    );
                    setDeleteSchedule(false);
                    document.body.style.overflow = 'auto';
                  }}
                >
                  Yes
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      <ViewSchedule
        setViewSchedule={setViewSchedule}
        viewSchedule={viewSchedule}
      />
      <ViewNotesWindow open={ViewNotes} setOpen={setViewNotes} />
    </>
  );
}

function ViewSchedule(props) {
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
  const schedule = useSelector((state) => state.scheduleRoot.schedule);
  const pdfref = useRef(null);
  const downloadPdf = () => {
    pdfref.current.save();
  };

  const convertTo12Hour = (time) => {
    const [hour, minute] = time.split(':');
    const date = new Date(1970, 0, 1, hour, minute);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <>
      {props.viewSchedule && (
        <div className='absolute top-0  z-20 h-full w-full p-3 backdrop-blur-md'>
          <Card className=' h-full w-full overflow-y-auto p-2'>
            <div className=' flex w-full justify-between'>
              <Button
                className='mb-2'
                onClick={() => {
                  props.setViewSchedule(false);
                  document.body.style.overflow = 'auto';
                }}
              >
                Close
              </Button>
              <span className=' flex items-center gap-2'>
                <ThemeSwich />
                <Button className='mb-2' onClick={downloadPdf}>
                  Download pdf
                </Button>
              </span>
            </div>

            <PDFExport
              scale={0.6}
              ref={pdfref}
              fileName={schedule.data.name}
              paperSize='A4'
            >
              <div className='m-auto min-h-full max-w-6xl overflow-y-auto rounded-sm border border-tremor-border  bg-tremor-background-subtle p-2 font-sans  text-tremor-content-strong  dark:border-dark-tremor-border dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-strong'>
                <div className=' mb-1 flex w-full justify-between'>
                  <div>
                    <h1 className='  font-bold'>
                      {schedule.data.schedule?.name}
                    </h1>
                    <h2>DOB : {formatDate(schedule.data.schedule?.dob)}</h2>
                  </div>

                  <div>
                    <span>
                      {formatDate(schedule.data?.start)} -{' '}
                      {formatDate(schedule.data?.end)}
                    </span>
                  </div>
                </div>{' '}
                <hr className=' border-t-2' />
                <section>
                  <div className=' grid grid-cols-2 gap-20'>
                    <span>
                      Initaial Weight : {schedule.data.schedule?.initialWeight}{' '}
                      kg
                    </span>
                    <span>
                      Current Weight : {schedule.data.schedule?.currentWeight}{' '}
                      kg
                    </span>
                  </div>
                  <div className=' grid grid-cols-2 gap-20'>
                    <span>
                      Initaial Height : {schedule.data.schedule?.initilaHeight}{' '}
                      cm
                    </span>
                    <span>
                      Current Height : {schedule.data.schedule?.currentHeight}{' '}
                      cm
                    </span>
                  </div>
                  <div className=' grid grid-cols-2 gap-20'>
                    <span>
                      Initaial Age : {schedule.data.schedule?.initialAge}
                    </span>
                    <span>Current Age : {schedule.data.schedule?.age}</span>
                  </div>
                </section>
                <br />
                <hr />
                <h2>Diet to be Followed</h2>
                <hr />
                <br />
                <table className='mt-5 w-full'>
                  <tr
                    style={{ border: '0.5px solid' }}
                    className='border-b-1 min-w-[90px] border-solid border-tremor-border align-text-top dark:border-dark-tremor-border'
                  >
                    <th className='min-w-[90px] p-2'>Sno.</th>
                    <th className='min-w-[120px] p-2'>Time</th>
                    <th className='min-w-[90px] p-2'>Recipe</th>
                  </tr>

                  {schedule.data.schedule?.diet.map((item, Index) => (
                    <tr
                      style={{ border: '0.5px solid' }}
                      key={Index}
                      className='border-b-1  min-w-[90px] border-solid border-tremor-border  align-text-top dark:border-dark-tremor-border'
                    >
                      <td className='min-w-[90px] p-2'>{Index + 1}</td>
                      <td className='min-w-[12px] p-2'>
                        {convertTo12Hour(item.mealTime)}
                      </td>
                      <td className='min-w-[90px] p-2'>
                        {item.mealTitle} <br /> {item.recipe}
                      </td>
                    </tr>
                  ))}
                </table>
                <br />
                <br />
                <div className=' grid grid-cols-1 gap-2'>
                  <h2>Notes:</h2>
                  <span>{schedule.data.schedule?.notes}</span>
                </div>
              </div>
            </PDFExport>
          </Card>
        </div>
      )}
    </>
  );
}

function ViewNotesWindow(props) {
  const [notes, setNotes] = useState('');
  const dispatch = useDispatch();
  const client = useSelector((state) => state.clientRoot.clients);
  const user = useSelector((state) => state.user);
  const handelNotes = async () => {
    dispatch(
      updateClient({
        token: user.token,
        id: client.data.id,
        data: {
          notes: notes,
        },
      })
    );
    props.setOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      {props.open && (
        <div className=' fixed left-0 top-0 h-full w-full overflow-scroll bg-tremor-background  p-5 dark:bg-dark-tremor-background '>
          <Button
            className='mb-2'
            onClick={() => {
              props.setOpen(false);
              document.body.style.overflow = 'auto';
            }}
          >
            close
          </Button>
          <Textarea
            className='mt-2'
            defaultValue={client.data.notes}
            onChange={(e) => {
              setNotes(e.target.value);
            }}
          />
          <Button className='mt-2' onClick={handelNotes}>
            Save
          </Button>
        </div>
      )}
    </>
  );
}
