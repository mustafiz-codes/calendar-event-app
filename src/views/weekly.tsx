import React, { useEffect, useState } from "react";
import { useCalendar } from "../context/CalendarContext";

interface Event {
  id: number;
  title: string;
  date: string; // ISO date string, e.g., "2023-12-25"
  startTime: string; // Time as a string, e.g., "10:00 AM"
  endTime?: string; // Optional end time as a string, e.g., "11:00 AM"
  description?: string;
  type?: "holiday" | "event" | "reminder"; // Add more types as needed
}

const Weekly: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const { currentDate } = useCalendar(); // Using currentDate from CalendarContext

  // useEffect(() => {
  //   // Replace with your actual API call
  //   fetch("/api/events")
  //     .then((response) => response.json())
  //     .then((data: Event[]) => setEvents(data))
  //     .catch(console.error);
  // }, [currentDate]); // Depend on currentDate to refetch when it changes

  useEffect(() => {
    setEvents([
      {
        id: 1,
        title: "Design review",
        date: "2023-12-03",
        startTime: "10:00 AM",
        endTime: "7:00 pM",
      },
      {
        id: 2,
        title: "Sales meeting",
        date: "2023-12-09",
        startTime: "2:00 AM",
        endTime: "11:00 AM",
      },
      {
        id: 3,
        title: "Sales meeting",
        date: "2023-12-15",
        startTime: "11:00 AM",
        endTime: "12:00 PM",
      },
      {
        id: 4,
        title: "Sales meeting",
        date: "2023-12-17",
        startTime: "10:00 AM",
        endTime: "11:00 AM",
      },
      {
        id: 5,
        title: "Sales meeting",
        date: "2023-12-21",
        startTime: "7:30 AM",
        endTime: "9:00 AM",
      },
      {
        id: 5,
        title: "Sales meeting",
        date: "2023-12-26",
        startTime: "12:00 AM",
        endTime: "2:00 PM",
      },
      {
        id: 6,
        title: "Sales meeting",
        date: "2023-12-29",
        startTime: "12:00 AM",
        endTime: "11:30 PM",
      },
      {
        id: 7,
        title: "Sales meeting",
        date: "2024-01-01",
        startTime: "12:00 AM",
        endTime: "11:59 PM",
      },
    ]);
  }, []);

  // Util function to get day name abbreviation
  const getDayNameAbbreviation = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  };

  const to24HourTime = (time: string): string => {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);

    if (hours === 12) {
      hours = 0; // Handle midnight and noon correctly
    }
    if (modifier.toUpperCase() === "PM") {
      hours += 12;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  // Function to get the current week's dates
  const getWeekDates = (date: Date) => {
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const weekDate = new Date(weekStart);
      weekDate.setDate(weekStart.getDate() + i);
      return {
        dayOfWeek: getDayNameAbbreviation(weekDate),
        fullDate: weekDate.toISOString().split("T")[0], // 'YYYY-MM-DD'
        date: weekDate.getDate(),
      };
    });
  };

  const weekDates = getWeekDates(currentDate);

  // Process events to be keyed by fullDate and startTime for easy access
  const eventsByDateAndTime: {
    [fullDate: string]: { [startTime: string]: Event[] };
  } = {};

  const times = Array.from({ length: 24 }, (_, index) => `${index}:00 `);

  const getHourIndex = (time: string): number => {
    const [hour] = time.split(":").map(Number);
    return hour; // returns 0 for 12:00 AM, 1 for 1:00 AM, etc.
  };

  const calculateTop = (startTime: string): number => {
    const [hours, minutes] = to24HourTime(startTime).split(":").map(Number);
    const hoursFromMidnight = hours + minutes / 60;
    return hoursFromMidnight * 48; // Assuming each hour is 48px high
  };

  // Calculates the height of the event div based on the event's duration
  const calculateHeight = (
    startTime: string,
    endTime: string | undefined
  ): number => {
    const start = to24HourTime(startTime);
    const end = endTime ? to24HourTime(endTime) : start;
    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":").map(Number);
    const durationInHours =
      endHours + endMinutes / 60 - (startHours + startMinutes / 60);
    return durationInHours * 48; // Assuming each hour is 48px high
  };

  // Populate the eventsByDateAndTime with actual events
  events.forEach((event: Event) => {
    const eventDate: string = event.date;
    const startTime24: string = to24HourTime(event.startTime);
    const timeSlot: string = `${getHourIndex(startTime24)}:00`; // Adjusted to match the hour index

    if (!eventsByDateAndTime[eventDate]) {
      eventsByDateAndTime[eventDate] = {};
    }
    if (!eventsByDateAndTime[eventDate][timeSlot]) {
      eventsByDateAndTime[eventDate][timeSlot] = [];
    }
    eventsByDateAndTime[eventDate][timeSlot].push(event);
  });

  console.log("Events by date and time:", eventsByDateAndTime); // Debugging line

  return (
    <div className="flex flex-col">
      {/* Day Names */}
      <div className="flex">
        <div className="w-16" /> {/* Placeholder for time column */}
        {weekDates.map((weekDate) => (
          <div
            key={weekDate.dayOfWeek}
            className="flex-1 text-center py-2 border"
          >
            <div>{weekDate.dayOfWeek}</div>
            <div>{weekDate.date}</div>
          </div>
        ))}
      </div>

      {/* Time Slots and Events */}
      <div className="flex flex-grow">
        {/* Time Column */}
        <div className="w-16">
          {times.map((time) => (
            <div
              key={time}
              className="h-12 border-b flex items-center justify-center text-xs"
            >
              {time}
            </div>
          ))}
        </div>

        {/* Event Columns */}
        {weekDates.map((weekDate) => (
          <div key={weekDate.fullDate} className="flex-1 border-l relative">
            {Object.entries(eventsByDateAndTime[weekDate.fullDate] || {}).map(
              ([startTime, events]) =>
                events.map((event) => (
                  <div
                    key={event.id}
                    className="absolute bg-sky-600 text-white text-xs rounded"
                    style={{
                      top: calculateTop(event.startTime) + "px",
                      height:
                        calculateHeight(event.startTime, event.endTime) + "px",
                      left: "0",
                      right: "0",
                      margin: "1px",
                    }}
                  >
                    {event.title} ({event.startTime} -{" "}
                    {event.endTime ?? event.startTime})
                  </div>
                ))
            )}
          </div>
        ))}

        {/*  */}
      </div>
    </div>
  );
};

export default Weekly;
