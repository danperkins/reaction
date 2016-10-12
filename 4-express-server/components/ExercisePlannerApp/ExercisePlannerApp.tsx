import * as React from 'react';

// import StaticExerciseCatalog from '../ExerciseCatalog/StaticCatalog';
// import StaticWorkoutHistory from '../WorkoutHistory/StaticWorkoutHistory';
import { IExercise } from '../Exercise/Exercise';
import { ExerciseFinder } from '../ExerciseFinder/ExerciseFinder';
import { IWorkout, WorkoutHistory } from '../WorkoutHistory/WorkoutHistory';
import * as axios from 'axios';
import './ExercisePlannerApp.less';

declare var fetch;

interface IExercisePlannerAppState {
  view: 'ExerciseFinder' | 'WorkoutHistory',
  exerciseCatalog: IExercise[],
  workoutHistory: IWorkout[]
}

export class ExercisePlannerApp extends React.Component<any,any> {
  private setFinderView: () => void;
  private setHistoryView: () => void;

  constructor() {
    super();

    // Initial state
    this.state = {
      view: 'ExerciseFinder',
      exerciseCatalog: null,
      workoutHistory: null
    }

    this.addNewWorkout = this.addNewWorkout.bind(this);
    this.setFinderView = () => this.setState({ view: 'ExerciseFinder'});
    this.setHistoryView = () => this.setState({ view: 'WorkoutHistory'});
  }

  addNewWorkout(workout: IWorkout) {
    return axios.post('http://localhost:3000/api/workout', workout).then((v) => {
      let workout = v.data;
      this.setState({
        workoutHistory: this.state.workoutHistory.concat([workout])
      })
      return workout;
    })
  }

  componentDidMount() {
    let workouts = axios.get('http://localhost:3000/api/workout').then((v) => v.data);
    let exercises = axios.get('http://localhost:3000/api/exercise').then((v) => v.data);

    Promise.all([workouts, exercises]).then((v) => {
      this.setState({
        workoutHistory: v[0],
        exerciseCatalog: v[1]
      })
    }).catch((err) => {
      console.log('Error: ' + err);
    });
    
  }

  render(): JSX.Element {
    let exerciseFinder = <ExerciseFinder catalog={this.state.exerciseCatalog} addNewWorkout={this.addNewWorkout} />
    let workoutHistory = <WorkoutHistory workouts={this.state.workoutHistory} />;
    let paneContent = this.state.view === 'ExerciseFinder' ? exerciseFinder : workoutHistory;

    if (this.state.exerciseCatalog && this.state.workoutHistory) {
      return (
        <div className="exercisePlannerApp">
          <div className="appHeader">
            <h1>Exercise Planner v2</h1>
            <div className="buttonContainer">
              <button className="appViewSwitch" onClick={this.setFinderView}>Exercise Finder</button>
              <button className="appViewSwitch" onClick={this.setHistoryView}>Workout History</button>
            </div>
          </div>
          {paneContent}
        </div>
      )
    } else {
      return <div>LOADING...</div>
    }
  }
}
