import * as React from 'react';

export interface IWorkout {
  exercises: string[];
  notes: string;
  date?: number;
}

export interface WorkoutHistoryProps {
  workouts: IWorkout[];
}

export function WorkoutHistory(props: WorkoutHistoryProps) {
  let inlineStyle = {
    borderTop: '2px solid orange',
    marginTop: '20px',
    paddingTop: '10px',
    paddingBottom: '20px'
  }

  let workoutItems = props.workouts.map((w) => {
      return (
        <div className="workout" style={inlineStyle}>
          <div>Exercises: {w.exercises.join(', ')}</div>
          <div>Notes: {w.notes}</div>
          <div>Date: {w.date}</div>
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
