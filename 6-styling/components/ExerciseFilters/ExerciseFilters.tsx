import * as React from 'react';
import './ExerciseFilters.less';

export interface IFilter {
  [id: string] : boolean;
}

export interface IExerciseFilter {
  displayText: string;
  matchCondition: string;
  filters: IFilter;
}
export interface IExerciseFilterContainer {
  [id: string] : IExerciseFilter;
}

export interface IExerciseFilterProps {
  filters: IExerciseFilterContainer;
  onFilterChange: (filters: IExerciseFilterContainer) => void;
}

export interface IExerciseFilterState {
  filters?: IExerciseFilterContainer;
  filterUpdate: number;
  unsavedFilters: boolean;
}

export class ExerciseFilters extends React.Component<IExerciseFilterProps, IExerciseFilterState> {
  private filterUpdate;
  private applyFilterUpdates: () => void;

  constructor(props) {
    super(props);
    let clonedFilters = this.cloneFilterContainer(this.props.filters);
    this.state = {
      filters: clonedFilters,
      filterUpdate: 1,
      unsavedFilters: false
    };

    this.filterUpdate = (fc, f) => {
      this.state.filters[fc].filters[f] = !this.state.filters[fc].filters[f];
      this.setState({filters: this.state.filters, filterUpdate: this.state.filterUpdate + 1, unsavedFilters: true});
    };

    this.applyFilterUpdates = () => {
      this.setState({ filterUpdate: this.state.filterUpdate + 1, unsavedFilters: false});
      let newFilterContainer = this.cloneFilterContainer(this.state.filters);
      this.props.onFilterChange(newFilterContainer);
    }
  }

  render() {
    let filterList = Object.keys(this.state.filters).map((fc) => {
      let filter = this.state.filters[fc];
      let items = Object.keys(filter.filters).map((i) => {
        let clickHandler = () => this.filterUpdate(fc, i);
        let checkbox = <input type="checkbox" readOnly checked={filter.filters[i]} />
        return <div className="filter" key={i} onClick={clickHandler}>{checkbox}  {i}</div>
      });
      return (
          <div className="filterGroup" key={filter.displayText}>
            <div className="filterGroupName"><b>{filter.displayText}</b></div>
            {items}
          </div>
      );
    });

    return (
      <div className="exerciseFilters">
        <div className="filterPaneHeader"><span className="title">Filter Pane</span></div>
        {filterList}
        <div><button ref="applyFilterBtn" onClick={this.applyFilterUpdates} disabled={!this.state.unsavedFilters}>ApplyFilter</button></div>
      </div>
    );
  }

  private cloneFilterContainer(fc: IExerciseFilterContainer): IExerciseFilterContainer {
    let newFc: IExerciseFilterContainer = {};
    for (let category in fc) {
      let f = fc[category];
      newFc[category] = {displayText: f.displayText, matchCondition: f.matchCondition, filters: {}};
      for (let filter in f.filters) {
        newFc[category].filters[filter] = f.filters[filter];
      }
    }

    return newFc;
  }
}
