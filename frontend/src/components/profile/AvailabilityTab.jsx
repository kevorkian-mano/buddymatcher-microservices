import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MY_AVAILABILITY } from '../../graphql/queries/availabilityQueries';
import { ADD_AVAILABILITY_SLOT, DELETE_AVAILABILITY_SLOT } from '../../graphql/mutations/availabilityMutations';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const AvailabilityTab = () => {
  const { data, loading, error, refetch } = useQuery(GET_MY_AVAILABILITY, { fetchPolicy: 'network-only' });
  const [addSlot] = useMutation(ADD_AVAILABILITY_SLOT);
  const [deleteSlot] = useMutation(DELETE_AVAILABILITY_SLOT);

  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [submitError, setSubmitError] = useState('');

  const slots = data?.getMyAvailability || [];

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setSubmitError('');
    try {
      await addSlot({
        variables: { dayOfWeek, startTime, endTime }
      });
      refetch();
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  const handleDeleteSlot = async (id) => {
    try {
      await deleteSlot({ variables: { id } });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading availability...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading availability!</div>;

  return (
    <div className="flex flex-col w-full bg-white rounded-[32px] max-md:max-w-full font-worksans px-8 py-10 mt-6 shadow-[0px_4px_24px_rgba(0,0,0,0.04)] border border-gray-100">
      <div className="flex justify-between items-center w-full mb-8">
        <h2 className="text-3xl font-playfair font-bold text-zinc-900 border-b-2 border-primary-500 pb-2">
          Weekly Availability
        </h2>
      </div>

      {submitError && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">{submitError}</div>}

      <form onSubmit={handleAddSlot} className="flex gap-4 items-end mb-10 bg-gray-50 p-6 rounded-2xl border border-gray-200 flex-wrap">
        <div className="flex flex-col flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-gray-700 mb-2">Day of Week</label>
          <select 
            value={dayOfWeek} 
            onChange={(e) => setDayOfWeek(parseInt(e.target.value))}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:border-zinc-900"
          >
            {DAYS.map((day, idx) => (
              <option key={idx} value={idx}>{day}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col flex-1 min-w-[150px]">
          <label className="text-sm font-medium text-gray-700 mb-2">Start Time</label>
          <input 
            type="time" 
            value={startTime} 
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:border-zinc-900"
          />
        </div>
        <div className="flex flex-col flex-1 min-w-[150px]">
          <label className="text-sm font-medium text-gray-700 mb-2">End Time</label>
          <input 
            type="time" 
            value={endTime} 
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:outline-none focus:border-zinc-900"
          />
        </div>
        <button 
          type="submit"
          className="px-8 py-3 bg-[#1a1a1a] text-white rounded-xl font-medium hover:bg-black transition-colors"
        >
          Add Time Slot
        </button>
      </form>

      <div className="flex flex-col gap-6">
        {DAYS.map((day, dayIndex) => {
          const daySlots = slots.filter(s => s.dayOfWeek === dayIndex).sort((a, b) => a.startTime.localeCompare(b.startTime));
          if (daySlots.length === 0) return null;
          
          return (
            <div key={dayIndex} className="flex flex-col">
              <h3 className="text-xl font-semibold text-zinc-800 mb-3">{day}</h3>
              <div className="flex gap-3 flex-wrap">
                {daySlots.map(slot => (
                  <div key={slot.id} className="flex items-center gap-2 bg-[#efd476]/30 border border-[#efd476] px-4 py-2 rounded-xl">
                    <span className="font-medium text-zinc-800">{slot.startTime} - {slot.endTime}</span>
                    <button 
                      onClick={() => handleDeleteSlot(slot.id)}
                      className="ml-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white text-zinc-600 transition-colors"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {slots.length === 0 && (
          <p className="text-gray-500 italic p-4 bg-gray-50 rounded-xl border border-gray-100">
            No availability slots defined yet. Use the form above to add your free times so we can match you with the best study buddies!
          </p>
        )}
      </div>
    </div>
  );
};
