import * as React from 'react';

import StaticExerciseCatalog from '../ExerciseCatalog/StaticCatalog';
import ExerciseCatalog from '../ExerciseCatalog/ExerciseCatalog';
import { IExercise } from '../Exercise/Exercise';
import { ExerciseFilters, IExerciseFilterContainer} from '../ExerciseFilters/ExerciseFilters';
import { IWorkout } from '../WorkoutHistory/WorkoutHistory';

import './ExerciseFinder.less';

interface ExerciseFinderProps {
  catalog: IExercise[];
  addNewWorkout: (workout: IWorkout) => void;
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
  private logWorkout: () => void;
  private clearWorkout: () => void;

  constructor(props) {
    super(props);

    // Initial state
    this.state = {
      filters: this.getFiltersFromCatalog(),
      searchString: "",
      currentWorkout: { exercises: [], notes: ''}
    }

    // Catalog callbacks
    this.onFilterChange = (fc: IExerciseFilterContainer) => this.updateFilters(fc);
    this.onSearchChange = () => this.updateSearchString();

    //Workout callbacks
    this.addExerciseCallback = (name: string) => this.addExerciseToCurrentWorkout(name);

    this.logWorkout = () => {
      let notes = (this.refs as any).workoutNotes;
      let newWorkout = this.state.currentWorkout;
      newWorkout.notes = notes.value;
      notes.value = '';

      this.props.addNewWorkout(newWorkout);
      this.setState({
        currentWorkout: { exercises: [], notes: ''},
      });
    }

    this.clearWorkout = () => {
      let notesInput = (this.refs as any).workoutNotes;
      notesInput.value = '';
      this.setState({
        currentWorkout: { exercises: [], notes: ''}
      })
    }
  }

  private addExerciseToCurrentWorkout(name: string): void {
    this.setState({
      currentWorkout: {
        exercises: this.state.currentWorkout.exercises.concat([name]),
        notes: this.state.currentWorkout.notes
      }
    });
  }

  render(): JSX.Element {
    let filteredItems = this.getFilteredItems();
    let currentWorkoutContent = this.state.currentWorkout.exercises.join(', ');

    return (
      <div className="exerciseFinder">
        <ExerciseFilters filters={this.state.filters} onFilterChange={this.onFilterChange} />
        <div className="exerciseCatalogArea">
          <div className="currentWorkout">
            <span className="title">Current Workout:</span><span>  {currentWorkoutContent}</span>
            <div className="controls">
              <button className="clearCurrentWorkout" onClick={this.clearWorkout}>Clear Workout</button>
              <button className="logWorkout" onClick={this.logWorkout} disabled={this.state.currentWorkout.exercises.length <= 0}>Log Workout</button>
              <span>Notes:<input type="text" ref="workoutNotes" /></span>
            </div>
          </div>
          <div className="catalogSearch">
            <span>Search Exercises:</span><input type="text" onChange={this.onSearchChange} ref="searchRef" />
          </div>
          <ExerciseCatalog catalog={filteredItems} addExerciseCallback={this.addExerciseCallback}/>
        </div>
      </div>
    );
  }

  // Apply the filters to the catalog and match the exercise 'Name' with the searchString
  private getFilteredItems(): IExercise[] {
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

  private updateSearchString(): void {
    let refString = (this.refs['searchRef'] as any).value;
    this.setState({
      searchString: refString
    })
  }

  private updateFilters(filterContainer: any): void {
    this.setState({
      filters: filterContainer
    });
  }

  private getFiltersFromCatalog(): IExerciseFilterContainer {
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


//ReactDOM.render(<ExerciseCatalog catalog={StaticExerciseCatalog} />, document.getElementById('appRoot'));
