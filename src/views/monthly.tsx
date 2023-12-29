import { useEffect, useState } from "react";
import GenerateCalendar from "../components/datePicker/GenerateCalendar";
import { useCalendar } from "../context/CalendarContext";
import { getDatesInRange } from "../components/common/common";

const MonthlyView = () => {
  const { currentDate } = useCalendar();
  const calendarDays = GenerateCalendar(currentDate);
  const [events, setEvents] = useState<EventsByDate>({});

  // useEffect(() => {
  //   fetch("/api/events")
  //     .then((response) => response.json())
  //     .then((data: Event[]) => setEvents(data))
  //     .catch(console.error);
  // }, [currentDate]);

  useEffect(() => {
    const fetchedEvents: Event[] = [
      {
        _id: "1",
        title: "Design review",
        startDate: "2023-12-24",
        endDate: "2023-12-26",
        isFullDay: true,
        repeat: "none",
      },
      {
        _id: "2",
        title: "Sales meeting",
        startDate: "2023-12-27",
        startTime: "2:00",
        endTime: "4:00",
        isFullDay: false,
        repeat: "none",
      },
      {
        _id: "3",
        title: "Design review",
        startDate: "2023-12-28",
        endDate: "2023-12-28",
        isFullDay: true,
        repeat: "none",
      },
      {
        _id: "4",
        title: "Design review",
        startDate: "2023-12-29",
        isFullDay: true,
        repeat: "none",
      },
      {
        _id: "5",
        title: "Code review",
        startDate: "2024-01-01",
        endDate: "2024-01-03",
        isFullDay: false,
        startTime: "2:00",
        endTime: "4:00",
        repeat: "none",
      },
      {
        _id: "6",
        title: "Design review",
        startDate: "2024-01-04",
        isFullDay: true,
        repeat: "none",
      },
    ];

    const newEvents: EventsByDate = fetchedEvents.reduce(
      (acc: EventsByDate, event: Event) => {
        const range: string[] = event.endDate
          ? getDatesInRange(event.startDate, event.endDate)
          : [event.startDate];

        range.forEach((date) => {
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push({
            ...event,
            startDate: date,
            ...(event.isFullDay
              ? { startTime: undefined, endTime: undefined }
              : {}),
          });
        });

        return acc;
      },
      {}
    );

    setEvents(newEvents);
  }, [currentDate]);

  interface CalendarDay {
    date: number; // Assuming this is the numeric day of the month
    isToday: boolean; // Indicates if this day is today
    fullDate: string; // The full date in 'YYYY-MM-DD' format
    currentMonth: boolean; // Indicates if this day is in the current month
    day: string;
    // ... any other properties that a day object might have
  }

  interface EventsByDate {
    [date: string]: Event[]; // This defines an index signature for the object
  }
  // Use the `useState` hook with the correct type

  interface Event {
    _id: string; // Using _id instead of id as per Mongoose schema
    title: string;
    description?: string;
    startDate: string; // ISO date string, e.g., "2023-12-25"
    endDate?: string; // ISO date string, e.g., "2023-12-25"
    startTime?: string; // Optional start time as a string, e.g., "10:00"
    endTime?: string; // Optional end time as a string, e.g., "11:00"
    isFullDay: boolean;
    repeat?: "none" | "daily" | "weekly" | "monthly" | "yearly";
    repeatCycle?: number;
  }

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
            className={`p-4 w-full text-center border ${
              !day.currentMonth && "text-gray-400"
            }`}
          >
            <div
              className={`text-sm ${
                day.isToday
                  ? "border-2 border-sky-600 rounded-3xl text-center"
                  : ""
              } ${day.isToday && "font-semibold"}`}
            >
              {day.date}
            </div>
            {events[day.fullDate] &&
              events[day.fullDate].map((event, idx) => (
                <div
                  key={`${event._id}-${idx}`}
                  className="text-left text-xs mt-1"
                >
                  <p
                    style={{
                      backgroundColor: event.isFullDay ? "#00FF00" : "#0066FF",
                      color: "#FFFFFF",
                      padding: "8px",
                      borderRadius: "4px",
                    }}
                  >
                    {event.title} -{" "}
                    {event.isFullDay
                      ? "All day"
                      : `${event.startTime || "Start"} to ${
                          event.endTime || "End"
                        }`}
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
