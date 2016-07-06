import * as React from 'react';

import StaticExerciseCatalog from '../ExerciseCatalog/StaticCatalog';
import StaticWorkoutHistory from '../WorkoutHistory/StaticWorkoutHistory';
import { IExercise } from '../Exercise/Exercise';
import { ExerciseFinder } from '../ExerciseFinder/ExerciseFinder';
import { IWorkout, WorkoutHistory } from '../WorkoutHistory/WorkoutHistory';

import './ExercisePlannerApp.less';

interface IExercisePlannerAppState {
  view: 'ExerciseFinder' | 'WorkoutHistory',
  exerciseCatalog: IExercise[],
  workoutHistory: IWorkout[]
}

export class ExercisePlannerApp extends React.Component<any,any> {
  private addNewWorkout: (workout: IWorkout) => void;

  private setFinderView: () => void;
  private setHistoryView: () => void;

  constructor() {
    super();

    // Initial state
    this.state = {
      view: 'ExerciseFinder',
      exerciseCatalog: StaticExerciseCatalog,
      workoutHistory: StaticWorkoutHistory
    }

    this.addNewWorkout = (workout: IWorkout) => {
      workout.date = Date.now();
      this.setState({
        workoutHistory: this.state.workoutHistory.concat([workout])
      })
    }

    this.setFinderView = () => this.setState({ view: 'ExerciseFinder'});
    this.setHistoryView = () => this.setState({ view: 'WorkoutHistory'});
}

  render(): JSX.Element {
    let exerciseFinder = <ExerciseFinder catalog={this.state.exerciseCatalog} addNewWorkout={this.addNewWorkout} />
    let workoutHistory = <WorkoutHistory workouts={this.state.workoutHistory} />;
    let paneContent = this.state.view === 'ExerciseFinder' ? exerciseFinder  : workoutHistory;

    return (
      <div className="exercisePlannerApp">
        <div className="appHeader">
          <h1>Exercise Planner</h1>
          <div className="buttonContainer">
            <button className="appViewSwitch" onClick={this.setFinderView}>Exercise Finder</button>
            <button className="appViewSwitch" onClick={this.setHistoryView}>Workout History</button>
          </div>
        </div>
        {paneContent}
      </div>
    )
  }
}
