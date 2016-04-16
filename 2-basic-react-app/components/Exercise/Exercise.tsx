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

export function Exercise(props: IExerciseProps) {
  return (
    <div className="exerciseItem" key={props.exercise.id}>
      <div className="name">{props.exercise.name}</div>
      <div className="description">{props.exercise.description}</div>
      <div className="muscleGroups"><span><b>Muscle Groups: </b></span>{props.exercise.muscleGroups.join(', ')}</div>
      <div className="equipment"><span><b>Equipment: </b></span>{props.exercise.equipment.join(', ')}</div>
      <button className="addExercise" onClick={props.addExerciseCallback}>Add To Workout</button>
    </div>
  )
}
