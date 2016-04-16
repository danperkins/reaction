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

export class ExerciseFilters extends React.Component<IExerciseFilterProps, any> {
  private filterUpdate;
  private allowUpdate = false;
  private applyFilterUpdates: () => void;
  constructor(props) {
    super(props);
    this.state = {
      filters: this.props.filters,
      unsavedFilters: false,
    };
    this.filterUpdate = (fc, f) => {
      this.state.filters[fc].filters[f] = !this.state.filters[fc].filters[f];
      this.allowUpdate = true;
      this.setState({filters: this.state.filters, unsavedFilters: true});
    };

    this.applyFilterUpdates = () => this.props.onFilterChange(this.state.filters);
  }

  render() {
    let filterList = Object.keys(this.state.filters).map((fc) => {
      let filter = this.state.filters[fc];
      let items = Object.keys(filter.filters).map((i) => {
        let clickHandler = () => this.filterUpdate(fc, i);
        let checkbox = null;
        if (filter.filters[i])
          checkbox = <input type="checkbox" checked="true" />
        else
          checkbox = <input type="checkbox" />
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

  public componentWillMount(): void {
    console.log("Will Mount");
  }

  public componentDidMount(): void {
    console.log("Did Mount");
  }

  public componentWillReceiveProps(nextProps: any): void {
    console.log("Will Receive Props");
  }

  public shouldComponentUpdate(nextProps: any, nextState): boolean {
    console.log("Should Update");
    if (this.allowUpdate) {
      this.allowUpdate = false;
      return true;
    } else
      return false;
  }

  public componentWillUpdate(nextProps: any, nextState: any): void {
    console.log("Will Update");
  }

  public componentDidUpdate(nextProps: any, nextState: any): void {
    console.log("Did update");
  }
}
