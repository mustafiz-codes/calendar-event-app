import React, { useState } from "react";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isAllDay, setIsAllDay] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const eventData = Object.fromEntries(formData);
    console.log(eventData, formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-lg md:text-xl font-bold mb-4">Add Event</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Add title"
            required
            className="px-4 py-2 border rounded"
          />
          <textarea
            placeholder="Description"
            className="px-4 py-2 border rounded"
          />
          <textarea placeholder="Note" className="px-4 py-2 border rounded" />
          <input type="date" required className="px-4 py-2 border rounded" />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              className="rounded"
            />
            <span>All day</span>
          </div>
          {!isAllDay && (
            <div className="grid grid-cols-2 gap-4">
              <input type="time" className="px-4 py-2 border rounded" />
              <input type="time" className="px-4 py-2 border rounded" />
            </div>
          )}
          <select className="px-4 py-2 border rounded">
            <option value="doesNotRepeat">Does not repeat</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
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
