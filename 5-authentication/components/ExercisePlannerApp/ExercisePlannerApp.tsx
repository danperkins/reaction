import * as React from 'react';

import { IExercise } from '../Exercise/Exercise';
import { ExerciseFinder } from '../ExerciseFinder/ExerciseFinder';
import { SignIn } from '../SignIn/SignIn';
import { IWorkout, WorkoutHistory } from '../WorkoutHistory/WorkoutHistory';
import axios from 'axios';
import './ExercisePlannerApp.less';
import { getAuthToken } from '../../services/auth';

declare var fetch;

interface IExercisePlannerAppState {
  view: 'ExerciseFinder' | 'WorkoutHistory',
  exerciseCatalog: IExercise[],
  workoutHistory: IWorkout[]
}

export class ExercisePlannerApp extends React.Component<any,any> {
  private setFinderView: () => void;
  private setHistoryView: () => void;

  constructor(props) {
    super(props);

    // Initial state
    this.state = {
      view: 'ExerciseFinder',
      exerciseCatalog: null,
      workoutHistory: null
    }

    this.addNewWorkout = this.addNewWorkout.bind(this);
    this.setFinderView = () => this.setState({ view: 'ExerciseFinder' });
    this.setHistoryView = () => {
      this.refreshWorkouts().then(data => {
        this.setState({ view: 'WorkoutHistory', workoutHistory: data });
      });
    }
    this.deleteWorkout = this.deleteWorkout.bind(this);
  }

  addNewWorkout(workout: IWorkout) {
    return axios.post('/api/workouts', workout).then((v) => {
      let workout = v.data;
      this.setState({
        workoutHistory: this.state.workoutHistory.concat([workout])
      })
      return workout as any;
    }).catch((e) => {
      let err = JSON.stringify(e.response.data.error);
      window.alert(err);
      return Promise.reject(err);
    }) as any;
  }

  deleteWorkout(workout: IWorkout) {
    return axios.delete('/api/workouts/' + workout.id).then((v) => {
      this.setState({
        workoutHistory: this.state.workoutHistory.filter((w) => w.id !== workout.id)
      })
    });
  }

  refreshWorkouts() {
    let workouts = Promise.resolve(null);
    const authToken = getAuthToken();
    if (authToken) {
      workouts = axios.get('/api/workouts', {
        headers: {
          'Accept': 'application/json',
          'Authorization':  `Bearer ${authToken}`
        }
      }).then((v) => v.data);
    }

    return workouts;
  }

  componentDidMount() {
    let workouts = this.refreshWorkouts();
    let exercises = axios.get('/api/exercises').then((v) => v.data);

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
    let workoutHistory = <WorkoutHistory workouts={this.state.workoutHistory} deleteWorkout={this.deleteWorkout} />;
    let paneContent = this.state.view === 'ExerciseFinder' ? exerciseFinder : workoutHistory;

    if (this.state.exerciseCatalog) {
      return (
        <div className="exercisePlannerApp">
          <div className="appHeader">
            <h1>Exercise Planner v2</h1>
            <div className="buttonContainer">
              <button className="appViewSwitch" onClick={this.setFinderView}>Exercise Finder</button>
              <button className="appViewSwitch" onClick={this.setHistoryView}>Workout History</button>
              <SignIn />
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
