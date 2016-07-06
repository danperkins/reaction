import * as React from 'react';

export interface IExercise {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  equipment: string[];
}

export interface IExerciseProps {
  exercise: IExercise;
  addExerciseCallback: () => void;
}

//export function Exercise(props: IExerciseProps) {
  export class Exercise extends React.Component<IExerciseProps, any> {
    constructor(props: IExerciseProps) {
      super(props);
    }
  render() {
    return (
    <div className="exerciseItem" key={this.props.exercise.id}>
      <div className="name">{this.props.exercise.name}</div>
      <div className="description">{this.props.exercise.description}</div>
      <div className="muscleGroups"><span><b>Muscle Groups: </b></span>{this.props.exercise.muscleGroups.join(', ')}</div>
      <div className="equipment"><span><b>Equipment: </b></span>{this.props.exercise.equipment.join(', ')}</div>
      <button className="addExercise" onClick={this.props.addExerciseCallback}>Add To Workout</button>
    </div>
  )
  }
}
