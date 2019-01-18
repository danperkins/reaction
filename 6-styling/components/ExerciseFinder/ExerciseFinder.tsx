import * as React from 'react';

import ExerciseCatalog from '../ExerciseCatalog/ExerciseCatalog';
import { IExercise } from '../Exercise/Exercise';
import { ExerciseFilters, IExerciseFilterContainer} from '../ExerciseFilters/ExerciseFilters';
import { IWorkout } from '../WorkoutHistory/WorkoutHistory';
import { NavPanePortal } from '../NavPane/NavPane';
import * as axios from 'axios';

import './ExerciseFinder.less';

interface ExerciseFinderProps {
  catalog: IExercise[];
  addNewWorkout: (workout: IWorkout) => Promise<any>;
}

interface ExerciseFinderState {
  filters?: IExerciseFilterContainer;
  searchString?: string;
  currentWorkout?: IWorkout;
}

export class ExerciseFinder extends React.Component<ExerciseFinderProps, ExerciseFinderState> {
  // These callbacks filter the catalog
  private onFilterChange: (filterContainer: IExerciseFilterContainer) => void;
  private onSearchChange: () => void;

  // Methods for managing the active Workout
  private addExerciseCallback: (name: string) => void;

  // Ref callbacks
  private searchRefCallback: (input: HTMLInputElement) => void;
  private searchRef: HTMLInputElement;
  private workoutNotesCallback: (input: HTMLInputElement) => void;
  private workoutNotes: HTMLInputElement;

  private clearWorkoutCallback: () => void;
  public logWorkoutCallback: () => void;

  constructor(props) {
    super(props);

    // Initial state
    this.state = {
      filters: this.getInitialFilters(),
      searchString: "",
      currentWorkout: { id: null, exercises: [], notes: ''}
    }

    // Catalog callbacks
    this.onFilterChange = (fc: IExerciseFilterContainer) => this.updateFilters(fc);
    this.onSearchChange = () => { this.setState({ searchString: this.searchRef.value }) };

    //Workout callbacks
    this.addExerciseCallback = (name: string) => this.addExerciseToCurrentWorkout(name);
    this.searchRefCallback = (input: HTMLInputElement) => { this.searchRef = input; }
    this.workoutNotesCallback = (input: HTMLInputElement) => { this.workoutNotes = input; }

    this.clearWorkoutCallback = () => this.clearWorkout();
    this.logWorkoutCallback = () => this.logWorkout();
  }

  render(): JSX.Element {
    let filteredItems = this.getFilteredItems();
    let currentWorkoutContent = this.state.currentWorkout.exercises.join(', ');

    return (
      <div className="exerciseFinder">

        <NavPanePortal>
          <ExerciseFilters filters={this.state.filters} onFilterChange={this.onFilterChange} />
        </NavPanePortal>

        <div className="exerciseCatalogArea">

          <div className="currentWorkout">
            <span className="title">Current Workout:</span><span>  {currentWorkoutContent}</span>
            <div className="controls">
              <button className="clearCurrentWorkout" onClick={this.clearWorkoutCallback}>Clear Workout</button>
              <button className="logWorkout" onClick={this.logWorkoutCallback} disabled={this.state.currentWorkout.exercises.length <= 0}>Log Workout</button>
              <span>Notes:<input className="notes" type="text" ref={this.workoutNotesCallback} /></span>
            </div>
          </div>

          <div className="catalogSearch">
            <span>Search Exercises:</span><input className="search" type="text" onChange={this.onSearchChange} ref={this.searchRefCallback} />
          </div>

          <ExerciseCatalog catalog={filteredItems} addExerciseCallback={this.addExerciseCallback}/>

        </div>
      </div>
    );
  }

  private logWorkout() {
    let newWorkout = this.state.currentWorkout;
    newWorkout.notes = this.workoutNotes.value;
    this.workoutNotes.value = '';

    return this.props.addNewWorkout(newWorkout).then((res) => {
      this.clearWorkout();
      return res;
    })
    .catch((e) => {
        console.log(e);
    });
  }

  private clearWorkout() {
    this.workoutNotes.value = '';
    this.setState({
      currentWorkout: { id: null, exercises: [], notes: ''}
    })
  }

  // Apply the filters to the catalog and match the exercise 'Name' with the searchString
  public getFilteredItems(): IExercise[] {
    return this.props.catalog.filter((e) => {
      return e.name.toLowerCase().indexOf(this.state.searchString.toLowerCase()) >= 0;
    }).filter((e) => {
      let allFieldsPass = Object.keys(this.state.filters).reduce((fieldv, field) => {
        let currentField = true;
        let filterList = e[field] as string[];

        if (this.state.filters[field].matchCondition === 'any') {
          return fieldv && filterList.reduce((itemv, item) => {
            return itemv || this.state.filters[field].filters[item];
          }, false);
        } else if (this.state.filters[field].matchCondition === 'all') {
          let allMatch = e[field].reduce(
            (itemv, item) => {

              let options: string[] = item.split('|');
              return itemv && options.reduce(
                  (ov, o) => {
                    return ov || this.state.filters[field].filters[o];
                  }, false);

            }, true);
          return fieldv && allMatch;
        } else
          return false;
      }, true);

      return allFieldsPass;
    });
  }

  public addExerciseToCurrentWorkout(name: string): void {
    this.setState({
      currentWorkout: {
        id: this.state.currentWorkout.id,
        exercises: this.state.currentWorkout.exercises.concat([name]),
        notes: this.state.currentWorkout.notes
      }
    });
  }

  private updateFilters(filterContainer: any): void {
    this.setState({ filters: filterContainer });
  }

  private getInitialFilters(): IExerciseFilterContainer {
    let filters: IExerciseFilterContainer = {
      muscleGroups: {
        displayText: 'Muscle Groups',
        matchCondition: 'any',
        filters: {}
      },
      equipment: {
        displayText: 'Equipment',
        matchCondition: 'all',
        filters: {}
      }
    };

    this.props.catalog.map((e: any) => {
      for (let category in filters) {
        e[category].map((itemList) => {
          itemList.split('|').map((item) => {
            filters[category].filters[item] = true;
          })
        });
      }
    });

    return filters;
  }
}
