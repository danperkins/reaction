import * as React from 'react';

import { IExercise } from '../Exercise/Exercise';
import { ExerciseFinder } from '../ExerciseFinder/ExerciseFinder';
import { IWorkout, WorkoutHistory } from '../WorkoutHistory/WorkoutHistory';
import * as axios from 'axios';
import './ExercisePlannerApp.less';
import { getUserData, signIn } from '../../services/auth';

declare var fetch;

interface IExercisePlannerAppState {
  view: 'ExerciseFinder' | 'WorkoutHistory',
  exerciseCatalog: IExercise[],
  workoutHistory: IWorkout[]
}

const clientId = '517001085227-90qlaf3fpbktccbg2fgitvi2478i51ok.apps.googleusercontent.com';
const clientSecret = 'vPLMoFYRt-e0RSecQBbiaFF8';

export class ExercisePlannerApp extends React.Component<any,any> {
  private setFinderView: () => void;
  private setHistoryView: () => void;
  private googleAuthWindow = null;

  constructor() {
    super();

    // Initial state
    this.state = {
      view: 'ExerciseFinder',
      exerciseCatalog: null,
      workoutHistory: null
    }

    this.addNewWorkout = this.addNewWorkout.bind(this);
    this.setFinderView = () => this.setState({ view: 'ExerciseFinder' });
    this.setHistoryView = () => this.setState({ view: 'WorkoutHistory' });
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

  componentDidMount() {
    let workouts = axios.get('/api/workouts', {
      headers: {
        'Accept': 'application/json'
      }
    }).then((v) => v.data);
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
    let userData = getUserData();

    if (this.state.exerciseCatalog && this.state.workoutHistory) {
      return (
        <div className="exercisePlannerApp">
          <div className="appHeader">
            <h1>Exercise Planner v2</h1>
            <div className="buttonContainer">
              <button className="appViewSwitch" onClick={this.setFinderView}>Exercise Finder</button>
              <button className="appViewSwitch" onClick={this.setHistoryView}>Workout History</button>
              {
                userData
                ? <span>SIGNED IN</span>
                : <button className="signIn" onClick={signIn}>Sign In</button>
              }
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
