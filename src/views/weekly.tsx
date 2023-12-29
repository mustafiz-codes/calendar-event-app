import React, { useEffect, useState } from "react";
import { useCalendar } from "../context/CalendarContext";
import {
  Event,
  calculateHeight,
  calculateTop,
  calculateWidthAndLeft,
  eventsByDateAndTime,
  getDatesInRange,
  getHourIndex,
  getWeekDates,
  times,
  to24HourTime,
} from "../components/common/common";
interface EventsByDateAndTime {
  [fullDate: string]: { [startTime: string]: Event[] };
}

const Weekly: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const { currentDate } = useCalendar(); // Using currentDate from CalendarContext

  // useEffect(() => {
  //   fetch("/api/events")
  //     .then((response) => response.json())
  //     .then((data: Event[]) => setEvents(data))
  //     .catch(console.error);
  // }, [currentDate]);

  useEffect(() => {
    setEvents([
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
        title: "Code review",
        startDate: "2024-01-01",
        endDate: "2024-01-03",
        isFullDay: false,
        startTime: "2:00",
        endTime: "4:00",
        repeat: "none",
      },
      {
        _id: "3",
        title: "Sales meeting",
        startDate: "2023-12-27",
        startTime: "2:00",
        endTime: "4:00",
        isFullDay: false,
        repeat: "none",
      },
      {
        _id: "4",
        title: "Design review",
        startDate: "2023-12-28",
        endDate: "2023-12-28",
        isFullDay: true,
        repeat: "none",
      },
      {
        _id: "5",
        title: "Design review",
        startDate: "2023-12-29",
        isFullDay: true,
        repeat: "none",
      },
      {
        _id: "6",
        title: "Design review",
        startDate: "2024-01-04",
        isFullDay: true,
        repeat: "none",
      },
    ]);
  }, []);

  const weekDates = getWeekDates(currentDate);

  // Populate the eventsByDateAndTime with actual events
  events.forEach((event: Event) => {
    if (event.isFullDay && event.endDate) {
      const eventDates = getDatesInRange(event.startDate, event.endDate);
      eventDates.forEach((date) => {
        const eventForDate = { ...event, startDate: date, endDate: date };
        if (!eventsByDateAndTime[date]) {
          eventsByDateAndTime[date] = {};
        }
        // Assuming full-day events don't have start/end times
        const timeSlot = "All day";
        if (!eventsByDateAndTime[date][timeSlot]) {
          eventsByDateAndTime[date][timeSlot] = [];
        }
        eventsByDateAndTime[date][timeSlot].push(eventForDate);
      });
    } else if (event.endDate) {
      const eventDates = getDatesInRange(event.startDate, event.endDate);
      eventDates.forEach((date) => {
        // Provide default values if startTime or endTime are undefined
        const startTime = event.startTime || "00:00";
        const endTime = event.endTime || "23:59";

        const eventForDate = {
          ...event,
          startDate: date,
          endDate: date,
          startTime,
          endTime,
        };
        if (!eventsByDateAndTime[date]) {
          eventsByDateAndTime[date] = {};
        }

        const timeSlot = event.isFullDay
          ? "All day"
          : `${to24HourTime(startTime)} - ${to24HourTime(endTime)}`;
        if (!eventsByDateAndTime[date][timeSlot]) {
          eventsByDateAndTime[date][timeSlot] = [];
        }
        eventsByDateAndTime[date][timeSlot].push(eventForDate);
      });
    } else {
      const eventDate: string = event.startDate;
      // Provide a default value for startTime if it's undefined
      const startTime24: string = to24HourTime(event.startTime || "00:00");
      const timeSlot: string = `${getHourIndex(startTime24)}:00`; // Adjusted to match the hour index

      if (!eventsByDateAndTime[eventDate]) {
        eventsByDateAndTime[eventDate] = {};
      }
      if (!eventsByDateAndTime[eventDate][timeSlot]) {
        eventsByDateAndTime[eventDate][timeSlot] = [];
      }
      eventsByDateAndTime[eventDate][timeSlot].push(event);
    }
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

        {weekDates.map((weekDate, index) => (
          <div key={weekDate.fullDate} className="flex-1 border-l relative">
            {Object.entries(
              eventsByDateAndTime[weekDate.fullDate] || {}
            ).flatMap(([startTime, events]) =>
              events.map((event: Event) => {
                const [width, left] = calculateWidthAndLeft(event, index);
                return (
                  <div
                    key={event._id}
                    className={`absolute ${
                      event.isFullDay ? "bg-green-500" : "bg-sky-600"
                    } text-white text-xs rounded`}
                    style={{
                      top: calculateTop(event) + "px",
                      height: calculateHeight(event) + "px",
                      left: `${left}%`,
                      width: `${width}%`,
                      margin: "1px",
                    }}
                  >
                    {event.title} ({event.startTime || "00:00"} -{" "}
                    {event.endTime || "24:00"})
                  </div>
                );
              })
            )}
          </div>
        ))}

        {/*  */}
      </div>
    </div>
  );
};

export default Weekly;
