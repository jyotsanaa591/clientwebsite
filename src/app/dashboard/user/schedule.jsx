'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

import ThemeSwich from '@/app/ThemeSwich';

import { PDFExport } from '@progress/kendo-react-pdf';
import { getRecipeByCombinationId } from '@/redux/features/combination_recipe';
import { makeSchedule, getScheduleById } from '@/redux/features/schedule';
import {
  Select,
  DatePicker,
  SelectItem,
  Text,
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

export default function Schedule() {
  const [viewSchedule, setViewSchedule] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [page, setPage] = useState(1);

  const schedule = useSelector((state) => state.scheduleRoot.schedule);
  const schedulelist = useSelector((state) => state.scheduleRoot.scheduleList);

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
        id: user.data.id,
        token: user.token,
      })
    );
  }, []);

  return (
    <>
      <div className=' p-3'>
        <div className=' flex items-center justify-between'>
          <div>
            <Title>
              {user.data.first_name} {user.data.last_name}
            </Title>
            <Text>{user.data.email}</Text>
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

      <ViewSchedule
        setViewSchedule={setViewSchedule}
        viewSchedule={viewSchedule}
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
              fileName={schedule.data?.name}
              paperSize='A4'
            >
              <div className='m-auto min-h-full max-w-6xl overflow-y-auto  border border-tremor-border  bg-white  font-sans  text-tremor-content-strong    '>
                <img
                  alt='letterhead'
                  className='w-full  object-cover'
                  src='/letterhead.png'
                />
                <div className=' mb-1 flex w-full justify-between px-2'>
                  <div>
                    <h1 className='  font-bold'>
                      {schedule.data?.schedule?.name}
                    </h1>
                    <h2>DOB : {formatDate(schedule.data?.schedule?.dob)}</h2>
                  </div>

                  <div>
                    <span>
                      {formatDate(schedule.data?.start)} -{' '}
                      {formatDate(schedule.data?.end)}
                    </span>
                  </div>
                </div>{' '}
                <hr className=' border-t-2  border-black' />
                <section className='px-2'>
                  <div className=' grid grid-cols-2 gap-20'>
                    <span>
                      Starting Weight : {schedule.data?.schedule?.initialWeight}{' '}
                      kg
                    </span>
                    <span>
                      Current Weight : {schedule.data?.schedule?.currentWeight}{' '}
                      kg
                    </span>
                  </div>
                  <div className=' grid grid-cols-2 gap-20'>
                    <span>
                      Height : {schedule.data?.schedule?.initilaHeight} cm
                    </span>
                    <span>Age : {schedule.data?.schedule?.initialAge}</span>
                  </div>
                </section>
                <br />
                <hr className='border-black' />
                <h2 className='px-2'>Diet to be Followed</h2>
                <hr className=' border-black' />
                <br />
                <section className='px-2'>
                  <table className='mt-5  w-full'>
                    <tr
                      style={{ border: '0.5px solid' }}
                      className='border-b-1 min-w-[90px] border-solid border-tremor-border align-text-top '
                    >
                      <th className='min-w-[90px] p-2'>Sno.</th>
                      <th className='min-w-[120px] p-2'>Time</th>
                      <th className='min-w-[90px] p-2'>Meal</th>
                    </tr>

                    {schedule.data?.schedule?.diet?.map((item, Index) => (
                      <tr
                        style={{ border: '0.5px solid' }}
                        key={Index}
                        className='border-b-1  min-w-[90px] border-solid border-tremor-border  align-text-top '
                      >
                        <td className='min-w-[90px] p-2'>{Index + 1}</td>
                        <td className='min-w-[12px] p-2'>
                          {convertTo12Hour(item.mealTime)}
                        </td>
                        <td className='min-w-[90px] p-2'>{item.mealTitle}</td>
                      </tr>
                    ))}
                  </table>
                </section>
                <br />
                <br />
                <div className=' grid grid-cols-1 gap-2 px-2'>
                  <h2>Notes:</h2>
                  <span>
                    {schedule.data?.schedule?.notes
                      .split('\n')
                      .map((line, index) => (
                        <div key={index}>
                          {line}
                          <br />
                        </div>
                      ))}
                  </span>
                </div>
                <div>
                  <br />

                  <section className='px-2'>
                    <h2>Recipes</h2>
                    <hr />

                    {schedule.data?.schedule?.diet?.map((item, Index) => (
                      <div
                        style={{ border: '0.5px solid' }}
                        key={Index}
                        className='border-b-1 min-w-[90px]  border-solid border-tremor-border p-1  align-text-top '
                      >
                        <h3 className='min-w-[12px] p-2'>
                          {item.mealTitle} - {convertTo12Hour(item.mealTime)}
                        </h3>
                        {item.recipe?.split('\n').map((line, index) => (
                          <div className=' px-2' key={index}>
                            {line}
                            <br />
                          </div>
                        ))}
                      </div>
                    ))}
                  </section>
                  <br />
                  <br />
                </div>
              </div>
            </PDFExport>
          </Card>
        </div>
      )}
    </>
  );
}
