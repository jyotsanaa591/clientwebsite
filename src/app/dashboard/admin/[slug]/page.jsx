'use client';


import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { userVerify } from '@/redux/features/user';
import React, { useState, useEffect, useRef } from 'react';

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
  Card,
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
  const [currentIndex, setCurrentIndex] = useState(null);
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
  const [selectedRecipes, setSelectedRecipes] = useState([]);

  const [formData, setFormData] = useState({
    name: client.data.first_name + ' ' + client.data.last_name,
    initialWeight: client.data.initial_weight,
    currentWeight: '',
    dob: client.data.dob,
    initialAge: client.data.age,

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
  const [recipeLoading, SetRecipeLoading] = useState(false);
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
    SetRecipeLoading;
    if (selectedCombination !== '') {
      const fetchRecipe = async () => {
        SetRecipeLoading(true);
        await dispatch(
          getRecipeByCombinationId({
            page: 1,
            search: '',
            token: user.token,
            id: selectedCombination,
          })
        );
        SetRecipeLoading(false);
      };

      fetchRecipe();
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

  const addMealToText = (item) => {
    const updatedTextAreaValues = [...textAreaValues];
    updatedTextAreaValues[currentIndex] = updatedTextAreaValues[currentIndex]
      ? `${updatedTextAreaValues[currentIndex]}\n${
          item?.recipe_id?.instruction || ''
        }`
      : `${item?.recipe_id?.instruction || ''}`;
    setTextAreaValues(updatedTextAreaValues);

    const fakeEvent = {
      target: {
        name: 'recipe',
        value: updatedTextAreaValues[currentIndex],
      },
    };

    handleMealChange(fakeEvent, currentIndex);
  };
  const addMealToInput = (item) => {
    const updatedTextInput = [...textInput];
    updatedTextInput[currentIndex] = updatedTextInput[currentIndex]
      ? `${updatedTextInput[currentIndex]}, ${item?.recipe_id?.title || ''}`
      : `${item?.recipe_id?.title || ''}`;
    setTextInput(updatedTextInput);

    const fakeEvent = {
      target: {
        name: 'mealTitle',
        value: updatedTextInput[currentIndex],
      },
    };

    handleMealChange(fakeEvent, currentIndex);
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
    setTextInput([]);
    setAddvalueFromList(false);

    document.body.style.overflow = 'hidden';
  };

  // useEffect(() => {
  //   if (
  //     !user.token ||
  //     user.data.role !== '105fbd5c-8423-4cd4-851a-6f3a95cab70f'
  //   ) {
  //     router.push('/');
  //   }
  // }, []);

  useEffect(() => {
  const verifyAccess = async () => {
    if (!user?.token) {
      router.push('/');
      return;
    }

    try {
      const res = await dispatch(userVerify({ token: user.token }));
      const roleId = res?.payload?.data?.role;

      console.log("Logged-in Role UUID:", roleId);

      if (
        roleId === "105fbd5c-8423-4cd4-851a-6f3a95cab70f" || // Admin
        roleId === "7fa6c95a-2a73-4a8f-85f9-408ffe87e23f" || // Viewer
        roleId === "0ce3fcd3-92a1-453d-8067-8308d5c372ad"   // User
      ) {
        console.log("Access granted to schedule page");
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error("Role check failed:", err);
      router.push('/');
    }
  };

  verifyAccess();
}, [user.token, dispatch, router]);
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
    const res = await dispatch(
      makeSchedule({
        page: 1,
        token: user.token,
        data: updatedScheduleData,
      })
    );

    await dispatch(
      updateClient({
        token: user.token,
        id: client.data.id,
        data: {
          end_date: updatedScheduleData.end,
        },
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
        <div className='fixed left-0 top-0 z-10 h-full w-full p-3 backdrop-blur-md'>
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

                <Button
                  className=' my-2 w-28'
                  onClick={() => {
                    setAddvalueFromList(!addvalueFromList);
                    setSelectedCombination('');
                    document.body.style.overflow = 'hidden';
                    setCurrentIndex(index);
                  }}
                >
                  Search Recipe
                </Button>

                {addvalueFromList && (
  <Card className="fixed left-0 top-0 z-30 h-[100vh] w-[100vw] overflow-y-auto p-3">
    <Button
      onClick={() => {
        setAddvalueFromList(false);
        document.body.style.overflow = "auto";
      }}
    >
      Close
    </Button>

    {/* Step 1: Choose combination */}
    {selectedCombination === "" && (
      <div>
        <TextInput
          type="search"
          className="mt-3"
          placeholder="Search Combination"
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {combinationList.data.map((item) => (
            <Card
              className="w-fit cursor-pointer"
              key={item.id}
              onClick={() => setSelectedCombination(item.id)}
            >
              {item.title}
            </Card>
          ))}
        </div>
      </div>
    )}

    {/* Step 2: Choose recipes */}
    {selectedCombination !== "" && (
      <div>
        <TextInput
          type="search"
          className="mt-3"
          placeholder="Search Recipe"
          onChange={(e) => setSearchRecipe(e.target.value)}
        />

        {recipeLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {recipeList.data.map((item) => {
              const isAlreadyAdded =
              formData.diet[currentIndex]?.mealTitle
                ?.split(" / ")
                ?.includes(item.recipe_id.title);

            if (isAlreadyAdded) return null;
              const isSelected = selectedRecipes.includes(item.id);
              return (
                <Card
                  key={item.id}
                  className={`w-fit cursor-pointer p-2 ${
                    isSelected ? "bg-green-200" : ""
                  }`}
                  onClick={() =>
                    setSelectedRecipes((prev) =>
                      prev.includes(item.id)
                        ? prev.filter((id) => id !== item.id)
                        : [...prev, item.id]
                    )
                  }
                >
                  {item?.recipe_id?.title}
                </Card>
              );
            })}
          </div>
        )}

        {selectedRecipes.length > 0 && (
          <div className="mt-4">
            <p className="mb-2">Selected: {selectedRecipes.length}</p>
            <Button
              onClick={() => {
                const chosen = recipeList.data.filter((r) =>
                  selectedRecipes.includes(r.id)
                );

                const titles = chosen
                  .map((item) => item?.recipe_id?.title || "")
                  .join(" / ");
                const instructions = chosen
                  .map((item) => item?.recipe_id?.instruction || "")
                  .join("\n\n");

                // ✅ Instead of overwriting, we append to previous ones
                setTextInput((prev) => {
                  const newInputs = [...prev];
                  newInputs[currentIndex] = prev[currentIndex]
                    ? prev[currentIndex] + " / " + titles
                    : titles;
                  return newInputs;
                });

                setTextAreaValues((prev) => {
                  const newAreas = [...prev];
                  newAreas[currentIndex] = prev[currentIndex]
                    ? prev[currentIndex] + "\n\n" + instructions
                    : instructions;
                  return newAreas;
                });

                setFormData((prev) => {
                  const updated = { ...prev };
                  const meal = updated.diet[currentIndex] || {};
                  meal.mealTitle = meal.mealTitle
                    ? meal.mealTitle + " / " + titles
                    : titles;
                  meal.recipe = meal.recipe
                    ? meal.recipe + "\n\n" + instructions
                    : instructions;
                  updated.diet[currentIndex] = meal;
                  return updated;
                });

                // Cleanup
                setSelectedRecipes([]);
                setAddvalueFromList(false);
                setSelectedCombination("");
                document.body.style.overflow = "auto";
              }}
            >
              Done
            </Button>
          </div>
        )}
      </div>
    )}
  </Card>
)}

                <Textarea
                  name='mealTitle'
                  className=' mb-2 h-16'
                  placeholder='Meal Title'
                  value={textInput[index] || ''}
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
                  placeholder='Recipe'
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
          onClick={async () => {
            setPage(1);
            await dispatch(
              getScheduleByclientID({
                page: 1,
                id: client.data.id,
                token: user.token,
              })
            );

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
                if (schedulelist?.data.length >= 10) {
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
          <div className='fixed top-0 z-20 grid  h-full w-full items-center p-3 backdrop-blur-md'>
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
                    await dispatch(
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
      <ViewTableWindow open={viewTable} setOpen={setViewTable} />
      <ViewMealHistoryWindow
        open={viewMealHistory}
        setOpen={setViewMealHistory}
      />
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
        <div className='fixed top-0  z-20 h-full w-full p-3 backdrop-blur-md'>
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
  ref={pdfref}
  fileName={schedule.data?.name || "Schedule"}
  paperSize="A4"
  margin={{ top: 30, left: 30, right: 30, bottom: 30 }} // ✅ Proper margin
  scale={0.8} // ✅ Ensures full fit within page
  forcePageBreak=".page-break"
>
  <div
    className="m-auto min-h-full max-w-[700px] bg-white font-sans text-black border border-gray-300 rounded-md p-6"
    style={{
      boxSizing: "border-box",
      lineHeight: 1.5,
      overflow: "hidden", // ✅ Prevents content cutoff
    }}
  >
    {/* Header */}
    <img
      alt="letterhead"
      className="w-full object-contain rounded-md mb-4"
      src="/letterhead.png"
    />

    {/* Name and Date Info */}
    <div className="flex justify-between items-center mb-3">
      <div>
        <h1 className="text-lg font-bold">
          {schedule.data?.schedule?.name || "Name Not Available"}
        </h1>
        <h2 className="text-sm">
          DOB:{" "}
          {schedule.data?.schedule?.dob
            ? formatDate(schedule.data.schedule.dob)
            : "Not Provided"}
        </h2>
      </div>
      <div className="text-sm text-right">
        {schedule.data?.start && schedule.data?.end
          ? `${formatDate(schedule.data.start)} – ${formatDate(schedule.data.end)}`
          : "Date not available"}
      </div>
    </div>

    <hr className="border-gray-700 mb-3" />

    {/* Info Section */}
    <section className="grid grid-cols-2 gap-4 text-sm mb-4">
      <span>
        Starting Weight:{" "}
        {schedule.data?.schedule?.initialWeight
          ? `${schedule.data.schedule.initialWeight} kg`
          : "N/A"}
      </span>
      <span>
        Current Weight:{" "}
        {schedule.data?.schedule?.currentWeight
          ? `${schedule.data.schedule.currentWeight} kg`
          : "N/A"}
      </span>
      <span>
        Height:{" "}
        {schedule.data?.schedule?.initilaHeight
          ? `${schedule.data.schedule.initilaHeight} cm`
          : "N/A"}
      </span>
      <span>Age: {schedule.data?.schedule?.initialAge || "N/A"}</span>
    </section>

    <hr className="border-gray-700 mb-3" />

    {/* Diet Table */}
    <h2 className="font-semibold text-base mb-2">Diet to be Followed</h2>
    <table className="w-full border-collapse border border-gray-400 text-sm mb-6">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-400 p-2 text-left">S.No</th>
          <th className="border border-gray-400 p-2 text-left">Time</th>
          <th className="border border-gray-400 p-2 text-left">Meal</th>
        </tr>
      </thead>
      <tbody>
        {schedule.data?.schedule?.diet?.length > 0 ? (
          schedule.data.schedule.diet.map((item, index) => (
            <tr key={index} className="align-top">
              <td className="border border-gray-400 p-2">{index + 1}</td>
              <td className="border border-gray-400 p-2">
                {item.mealTime ? convertTo12Hour(item.mealTime) : "N/A"}
              </td>
              <td className="border border-gray-400 p-2">
                {item.mealTitle
                  ? item.mealTitle.split("\n").map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))
                  : "No meal details"}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="3"
              className="border border-gray-400 p-3 text-center text-gray-500"
            >
              No diet data available
            </td>
          </tr>
        )}
      </tbody>
    </table>

    {/* Notes Section */}
    <h2 className="font-semibold mb-1">Notes:</h2>
    <div className="bg-gray-50 p-3 rounded text-sm mb-6 border border-gray-200">
      {(() => {
        const notes = schedule.data?.schedule?.notes;
        if (!notes) return "No notes available.";
        if (typeof notes === "string")
          return notes.split("\n").map((line, i) => <div key={i}>{line}</div>);
        if (typeof notes === "object")
          return (
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(notes, null, 2)}
            </pre>
          );
        return String(notes);
      })()}
    </div>

    {/* Recipes */}
    <h2 className="font-semibold text-base mb-2">Recipes</h2>
    {schedule.data?.schedule?.diet?.length > 0 ? (
      schedule.data.schedule.diet.map((item, index) => (
        <div
          key={index}
          className="border border-gray-300 rounded-md p-3 mb-3 break-inside-avoid"
        >
          <h3 className="font-semibold text-sm mb-1">
            {item.mealTime ? convertTo12Hour(item.mealTime) : "N/A"} —{" "}
            {item.mealTitle || "Untitled Meal"}
          </h3>
          <div className="text-sm">
            {item.recipe
              ? item.recipe.split("\n").map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))
              : "No recipe details available."}
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-sm">No recipes available.</p>
    )}
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
    await dispatch(
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
            className='mt-2 h-[80%] w-full resize-none'
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

function ViewTableWindow(props) {
  const dispatch = useDispatch();
  const client = useSelector((state) => state.clientRoot.clients); // Assuming 'client' is an object
  const user = useSelector((state) => state.user);

  const [tableData, setTableData] = useState(
    client.data?.aditional_chart || []
  );

  const handleAddRow = () => {
    const newTableData = [
      ...tableData,
      ['', '', '', '', '', '', '', '', '', ''],
    ];
    setTableData(newTableData);
  };

  const handleCellChange = (newValue, rowIndex, cellIndex) => {
    const updatedTableData = [...tableData];
    updatedTableData[rowIndex][cellIndex] = newValue;
    setTableData(updatedTableData);
  };

  const handleRemoveRow = (id) => {
    const newTableData = [...tableData];
    newTableData.splice(id, 1);
    setTableData(newTableData);
  };

  const handelSave = async () => {
    dispatch(
      updateClient({
        token: user.token,
        id: client.data.id,
        data: {
          aditional_chart: tableData,
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
            Close
          </Button>
          <Card>
            <Table>
              <TableBody>
                {tableData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell className='  p-1' key={cellIndex}>
                        <TextInput
                          defaultValue={cell}
                          value={cell}
                          onChange={(e) =>
                            handleCellChange(
                              e.target.value,
                              rowIndex,
                              cellIndex
                            )
                          }
                        />
                      </TableCell>
                    ))}
                    <TableCell className=' p-0.5'>
                      <Button onClick={() => handleRemoveRow(rowIndex)}>
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <button onClick={handleAddRow}>Add Row</button>
          </Card>
          <Button
            className='mt-2'
            onClick={() => {
              handelSave();
            }}
          >
            Save
          </Button>
        </div>
      )}
    </>
  );
}

function ViewMealHistoryWindow(props) {
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
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  const client = useSelector((state) => state.clientRoot.clients);
  const user = useSelector((state) => state.user);
  const scheduleList = useSelector((state) => state.scheduleRoot.scheduleList);

  useEffect(() => {
    dispatch(
      getScheduleByclientID({
        page: page,
        id: client.data.id,
        token: user.token,
      })
    );
  }, []);

  return (
    <>
      {props.open && (
        <div className=' fixed left-0 top-0 h-full w-full overflow-scroll bg-tremor-background  p-5 dark:bg-dark-tremor-background '>
          <Button
            className='mb-2'
            onClick={async () => {
              setPage(1);
              await dispatch(
                getScheduleByclientID({
                  page: page,
                  id: client.data.id,
                  token: user.token,
                })
              );
              props.setOpen(false);
              document.body.style.overflow = 'auto';
            }}
          >
            Close
          </Button>
          <Card>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>From Date</TableHeaderCell>
                  <TableHeaderCell>End Date</TableHeaderCell>
                  <TableHeaderCell>Meals</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scheduleList.data?.map((item, Index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.schedule_id && formatDate(item.schedule_id.start)}
                    </TableCell>
                    <TableCell>
                      {item.schedule_id && formatDate(item.schedule_id.end)}
                    </TableCell>
                    <TableCell className=' flex max-w-md flex-wrap'>
                      {item.schedule_id?.schedule?.diet?.map((meal, index) => (
                        <span
                          className=' rounded-full bg-tremor-background-subtle p-0.5 dark:bg-dark-tremor-background-subtle'
                          key={index}
                        >
                          {meal.mealTitle}
                        </span>
                      ))}
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
                  if (scheduleList?.data.length >= 10) {
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
      )}
    </>
  );
}
