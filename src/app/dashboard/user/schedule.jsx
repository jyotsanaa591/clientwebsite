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
  ref={pdfref}
  fileName={schedule.data?.name || "Schedule"}
  paperSize="A4"
  scale={0.8} // 🔹 ensures fit inside A4 width
  margin={{ top: 30, left: 30, right: 30, bottom: 30 }} // 🔹 A4 standard margins
>
  <div
    style={{
      width: "700px", // 🔹 A4 safe printable width (~7.3 inches)
      margin: "0 auto",
      backgroundColor: "white",
      padding: "24px 36px",
      fontFamily: "Arial, sans-serif",
      color: "#000",
      boxSizing: "border-box",
      lineHeight: "1.6",
      overflow: "hidden", // 🔹 prevents content overflow cutoff
    }}
  >
    {/* === Letterhead === */}
    <img
      alt="letterhead"
      style={{
        width: "100%",
        objectFit: "contain",
        marginBottom: "16px",
      }}
      src="/letterhead.png"
    />

    {/* === Header Info === */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "12px",
        alignItems: "center",
      }}
    >
      <div>
        <h1 style={{ fontWeight: "bold", fontSize: "18px", margin: 0 }}>
          {schedule.data?.schedule?.name || "Name not available"}
        </h1>
        <h2 style={{ fontSize: "14px", margin: 0 }}>
          DOB:{" "}
          {schedule.data?.schedule?.dob
            ? formatDate(schedule.data.schedule.dob)
            : "Not provided"}
        </h2>
      </div>
      <div style={{ textAlign: "right", fontSize: "14px" }}>
        {/* 🧠 Prevent NaN undefined */}
        {schedule.data?.start && schedule.data?.end
          ? `${formatDate(schedule.data.start)} - ${formatDate(schedule.data.end)}`
          : "Date not available"}
      </div>
    </div>

    <hr style={{ borderTop: "1px solid black", margin: "12px 0" }} />

    {/* === Basic Info === */}
    <section style={{ marginBottom: "16px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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
      </div>
    </section>

    <hr style={{ borderTop: "1px solid black", margin: "12px 0" }} />

    {/* === Diet Table === */}
    <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "8px" }}>
      Diet to be Followed
    </h2>
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "13px",
        marginBottom: "20px",
      }}
    >
      <thead>
        <tr style={{ background: "#f5f5f5" }}>
          <th style={{ border: "1px solid #000", padding: "8px", textAlign: "left" }}>Sno.</th>
          <th style={{ border: "1px solid #000", padding: "8px", textAlign: "left" }}>Time</th>
          <th style={{ border: "1px solid #000", padding: "8px", textAlign: "left" }}>Meal</th>
        </tr>
      </thead>
      <tbody>
        {schedule.data?.schedule?.diet?.length > 0 ? (
          schedule.data.schedule.diet.map((item, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #000", padding: "8px" }}>{index + 1}</td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                {item.mealTime ? convertTo12Hour(item.mealTime) : "N/A"}
              </td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                {item.mealTitle
                  ? item.mealTitle.split("\n").map((line, i) => <div key={i}>{line}</div>)
                  : "N/A"}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" style={{ textAlign: "center", padding: "8px" }}>
              No diet data available
            </td>
          </tr>
        )}
      </tbody>
    </table>

    {/* === Notes === */}
    <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "6px" }}>Notes:</h2>
    <div
      style={{
        backgroundColor: "#f8f8f8",
        padding: "10px",
        borderRadius: "6px",
        fontSize: "13px",
        marginBottom: "20px",
        border: "1px solid #ddd",
      }}
    >
      {(() => {
        const notes = schedule.data?.schedule?.notes;
        if (!notes) return "No notes available.";
        if (typeof notes === "string")
          return notes.split("\n").map((line, i) => <div key={i}>{line}</div>);
        if (typeof notes === "object")
          return <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(notes, null, 2)}</pre>;
        return String(notes);
      })()}
    </div>

    {/* === Recipes Section === */}
    <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>Recipes</h2>
    {schedule.data?.schedule?.diet?.map((item, index) => (
      <div
        key={index}
        style={{
          border: "1px solid #ccc",
          borderRadius: "6px",
          padding: "10px",
          marginBottom: "10px",
          backgroundColor: "#fff",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>
          {item.mealTime ? convertTo12Hour(item.mealTime) : "N/A"} —{" "}
          {item.mealTitle || "Untitled Meal"}
        </h3>
        <div style={{ marginTop: "5px", fontSize: "13px" }}>
          {item.recipe
            ? item.recipe.split("\n").map((line, i) => <div key={i}>{line}</div>)
            : "No recipe details"}
        </div>
      </div>
    ))}
  </div>
</PDFExport>
          </Card>
        </div>
      )}
    </>
  );
}
