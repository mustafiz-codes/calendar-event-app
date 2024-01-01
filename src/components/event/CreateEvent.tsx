import React, { useEffect, useState } from "react";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isAllDay, setIsAllDay] = useState(false);

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    notes: "",
    startDate: "",
    endDate: "",
    startTime: "",
    isFullDay: isAllDay,
    endTime: "",
    repeat: "none",
    repeatCycle: "none",
  });

  useEffect(() => {
    // Reset repeatCycle when repeat is set to none
    if (eventData.repeat === "none") {
      setEventData({ ...eventData, repeatCycle: "none" });
    }
  }, [eventData.repeat]);

  useEffect(() => {
    setEventData((currentEventData) => ({
      ...currentEventData,
      isFullDay: isAllDay,
    }));
  }, [isAllDay]);

  // handle endTime
  // check startTime

  // handle startTime
  // { startTime + =1 by hour}

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    if (name === "startTime") {
      const [hours, minutes] = value.split(":").map(Number);

      const endTimeHour = (hours + 1) % 24; // Use % 24 to handle the case where startTime is 23:00

      const formattedEndTime = `${endTimeHour
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

      console.log("formattedEndTime", formattedEndTime);

      setEventData((currentEventData) => ({
        ...currentEventData,
        [name]: value,
        endTime:
          currentEventData.endTime === ""
            ? formattedEndTime
            : currentEventData.endTime,
      }));
    } else {
      setEventData((currentEventData) => ({
        ...currentEventData,
        [name]: value,
      }));
    }
    // setEventData({ ...eventData, [name]: value });
  };

  useEffect(() => {
    console.log("tartTime, endTime", eventData.startTime, eventData.endTime);
  }, [eventData]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Add validation logic here if needed

    if (eventData.startDate === null || eventData.startDate === "") {
      alert("Please enter a start date");
      return;
    }

    if (eventData.endDate === null || eventData.endDate === "") {
      eventData.endDate = eventData.startDate;
    }
    const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (
      !isAllDay &&
      (!timeFormat.test(eventData.startTime) ||
        !timeFormat.test(eventData.endTime))
    ) {
      alert("Please enter time in HH:MM format.");
      return;
    }

    const [startHours, startMinutes] = eventData.startTime
      .split(":")
      .map(Number);
    const [endHours, endMinutes] = eventData.endTime.split(":").map(Number);

    if (
      endHours < startHours ||
      (endHours === startHours && endMinutes < startMinutes)
    ) {
      alert("End time cannot be before start time.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      console.log("response", response.body);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error in response:", errorData);
        throw new Error("Failed to create event");
      }

      onClose(); // Close the modal
      window.location.reload();
    } catch (error) {
      console.error("Error in creating event:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-lg md:text-xl font-bold mb-4">Add Event</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto"
        >
          <input
            type="text"
            name="title"
            placeholder="Add title"
            required
            className="px-4 py-2 border rounded"
            onChange={handleInputChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            className="px-4 py-2 border rounded"
            onChange={handleInputChange}
          />
          <textarea
            name="notes"
            placeholder="Note"
            className="px-4 py-2 border rounded"
            onChange={handleInputChange}
          />
          <div className="flex justify-between gap-4">
            <div className="w-full">
              <label className="block">
                <span className="text-gray-700">Start Date</span>
                <input
                  type="date"
                  name="startDate"
                  required
                  className="mt-1 px-4 py-2 border rounded w-full"
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div className="w-full">
              <label className="block">
                <span className="text-gray-700">End Date</span>
                <input
                  type="date"
                  name="endDate"
                  className="mt-1 px-4 py-2 border rounded w-full"
                  onChange={handleInputChange}
                />
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              className="rounded "
            />
            <span>All day</span>
          </div>
          {!isAllDay && (
            <div className="flex justify-between gap-4">
              <div className="w-full">
                <label className="block">
                  <span className="text-gray-700">Start Time</span>
                  <input
                    type="time"
                    name="startTime"
                    className="px-4 py-2 border rounded w-full"
                    onChange={handleInputChange}
                  />
                </label>
              </div>
              <div className="w-full">
                <label className="block">
                  <span className="text-gray-700">End Time</span>
                  <input
                    type="time"
                    name="endTime"
                    value={eventData.endTime}
                    className="px-4 py-2 border rounded w-full"
                    onChange={handleInputChange}
                  />
                </label>
              </div>
            </div>
          )}

          <div className="w-full">
            <label className="block">
              <span className="text-gray-700">Repeat</span>
              <select
                name="repeat"
                className="px-4 py-2 border rounded w-full"
                onChange={handleInputChange}
                value={eventData.repeat}
              >
                <option value="none">Does not repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </label>
          </div>

          {eventData.repeat !== "none" && (
            <div className="w-full">
              <label className="block">
                <span className="text-gray-700">Repeat Cycle</span>
                <select
                  name="repeatCycle"
                  className="px-4 py-2 border rounded w-full"
                  onChange={handleInputChange}
                  value={eventData.repeatCycle}
                >
                  <option value="none">None</option>
                  <option value="daily">Daily</option>
                  <option value="biweekly">Biweekly</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </label>
            </div>
          )}
          <button
            type="submit"
            className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Event
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
