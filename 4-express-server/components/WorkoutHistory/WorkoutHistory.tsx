import * as React from 'react';
import * as axios from 'axios';

import './WorkoutHistory.less';

export interface IWorkout {
  id: string;
  exercises: string[];
  notes?: string;
  date?: number;
}

export interface IWorkoutHistoryProps {
  workouts: IWorkout[];
  deleteWorkout: (w: IWorkout) => void;
}

export function WorkoutHistory(props: IWorkoutHistoryProps) {
  let workoutItems = props.workouts.map((w, i) => {
      return (
        <div className='workout' key={i}>
          <div>Exercises: {w.exercises.join(', ')}</div>
          <div>Notes: {w.notes}</div>
          <div>Date: {w.date}</div>
          <div className='deleteBtn' onClick={() => props.deleteWorkout(w)}>x</div>
        </div>
      );
  });

  return (
    <div className="workoutHistory">
      <div><h2>Workout History</h2></div>
      {workoutItems}
    </div>

  );
}
