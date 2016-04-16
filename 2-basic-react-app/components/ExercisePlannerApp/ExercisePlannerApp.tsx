import * as React from 'react';

import StaticExerciseCatalog from '../ExerciseCatalog/StaticCatalog';
import StaticWorkoutHistory from '../WorkoutHistory/StaticWorkoutHistory';
import { ExerciseFinder } from '../ExerciseFinder/ExerciseFinder';
import { IWorkout, WorkoutHistory } from '../WorkoutHistory/WorkoutHistory';

import './ExercisePlannerApp.less';

export class ExercisePlannerApp extends React.Component<any,any> {
  private addNewWorkout: (workout: IWorkout) => void;

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
}

  render(): JSX.Element {
    let paneContent = this.state.view === 'ExerciseFinder' ? <ExerciseFinder catalog={this.state.exerciseCatalog} addNewWorkout={this.addNewWorkout}/>  : <WorkoutHistory workouts={this.state.workoutHistory}/>;
    let setFinderView = () => this.setState({ view: 'ExerciseFinder'});
    let setHistoryView = () => this.setState({ view: 'WorkoutHistory'});
    return (
      <div className="exercisePlannerApp">
        <div className="appHeader">
          <h1>Exercise Planner</h1>
          <div className="buttonContainer">
            <button className="appViewSwitch" onClick={setFinderView}>Exercise Finder</button>
            <button className="appViewSwitch" onClick={setHistoryView}>Workout History</button>
          </div>
        </div>
        {paneContent}
      </div>
    )
  }
}
