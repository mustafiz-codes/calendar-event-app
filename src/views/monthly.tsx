import { useEffect, useState } from "react";
import GenerateCalendar from "../components/datePicker/GenerateCalendar";
import { useCalendar } from "../context/CalendarContext";

const MonthlyView = () => {
  const { currentDate } = useCalendar(); // Use currentDate from context
  const calendarDays = GenerateCalendar(currentDate); // Use currentDate

  interface CalendarDay {
    date: number; // Assuming this is the numeric day of the month
    isToday: boolean; // Indicates if this day is today
    fullDate: string; // The full date in 'YYYY-MM-DD' format
    currentMonth: boolean; // Indicates if this day is in the current month
    day: string;
    // ... any other properties that a day object might have
  }

  interface EventsByDate {
    [key: string]: Event[]; // This defines an index signature for the object
  }

  interface Event {
    id: number;
    title: string;
    date: string; // ISO date string, e.g., "2023-04-12"
    startTime: string;
    endTime: string;
  }

  const events = [
    {
      id: 1,
      title: "Design review",
      date: "2023-12-03",
      startTime: "11PM",
      endTime: "11PM",
    },
    {
      id: 2,
      title: "Sales meeting",
      date: "2023-12-09",
      startTime: "2PM",
      endTime: "11PM",
    },
    {
      id: 3,
      title: "Sales meeting",
      date: "2023-12-15",
      startTime: "5PM",
      endTime: "11PM",
    },
    {
      id: 4,
      title: "Sales meeting",
      date: "2023-12-17",
      startTime: "11PM",
      endTime: "11PM",
    },
    {
      id: 5,
      title: "Sales meeting",
      date: "2023-12-21",
      startTime: "2PM",
      endTime: "11PM",
    },
    {
      id: 5,
      title: "Sales meeting",
      date: "2023-12-26",
      startTime: "2PM",
      endTime: "11PM",
    },
    {
      id: 6,
      title: "Sales meeting",
      date: "2023-12-29",
      startTime: "7PM",
      endTime: "11PM",
    },
    {
      id: 7,
      title: "Sales meeting",
      date: "2024-01-01",
      startTime: "2PM",
      endTime: "11PM",
    },
    // ... more events
  ];

  const eventsByDate: EventsByDate = events.reduce(
    (acc: EventsByDate, event: Event) => {
      (acc[event.date] = acc[event.date] || []).push(event);
      return acc;
    },
    {}
  );

  return (
    <div className="rounded-lg shadow h-full mb-12 overflow-hidden">
      <div className="grid grid-cols-7 text-center border-b">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="px-4 py-2 font-medium">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 h-full border-b">
        {calendarDays.map((day: CalendarDay, index: number) => (
          <div
            key={index}
            className={`p-4 w-full text-center border
            ${!day.currentMonth && "text-gray-400"}`}
          >
            <div
              className={`text-sm 
            ${
              day.isToday
                ? "border-2 border-sky-600 rounded-3xl text-center"
                : ""
            }
            ${day.isToday && "font-semibold"}`}
            >
              {day.date}
            </div>
            {eventsByDate[day.fullDate] &&
              eventsByDate[day.fullDate].map((event) => (
                <div key={event.id} className="text-left text-xs mt-1">
                  <p className="bg-sky-600 text-white p-1">
                    {event.title} - {event.startTime} to {event.endTime}
                  </p>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyView;
