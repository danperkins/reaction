import * as React from 'react';
import axios from 'axios';

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

interface Counter {
  count: number;
}

export class WorkoutHistory extends React.Component<IWorkoutHistoryProps, any> {
  private val1 = null;
  private artist = null;
  constructor(props) {
    super(props);
    this.state = {
      relatedArtists: null,
      e: null
    }
  }

  render() {
    let workoutItems = null;
    let workoutPlaceholder = <p>After signing in and saving your workouts you can see them here!</p>
    if (this.props.workouts) {
      workoutItems = this.props.workouts.map((w, i) => {
          return (
            <div className='workout' key={i}>
              <div>Exercises: {w.exercises.join(', ')}</div>
              <div>Notes: {w.notes}</div>
              <div>Date: {w.date}</div>
              <div className='deleteBtn' onClick={() => this.props.deleteWorkout(w)}>x</div>
            </div>
          );
      });
    }

  
    return (
      <div className="workoutHistory">
        <div><h2>Workout History</h2></div>
        {workoutItems || workoutPlaceholder}
      </div>

    );
  }
}
