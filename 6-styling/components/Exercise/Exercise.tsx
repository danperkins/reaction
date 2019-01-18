import * as React from 'react';

enum ExerciseCapacityType {
  Time,
  Distance,
  Weight,
  Other
}

enum TimeFormat {
  
}

export interface RepCapacity {

}

export interface IExerciseCapacity {

}
/* TEST
  BenchPress
    65lbs
    5
    warmup
  BenchPress
    75lbs
    5
    warmup
  BenchPress
    85lbs
    5
    warmup
  BenchPress
    125lbs
    5
  BenchPress
    130lbs
    3
  BenchPress
    135lbs
    1
    4 Reps total to failure

  Add all to group
    description: Core Bench Strength work (week 3)
    exercises: above in an array
    sets: 1
  
    New group

  Pullups
    weight: bodyweight
    6 reps
    High pulls
  Banded side steps
    capacity: orange band
    10 reps
  Dips
    weight: 25lbs
    6 reps
  
  new Group
    description: 5-3-1 bench accessory work
    exercises: above in an array
    sets: 4

  IWorkout
    5-3-1 Bench week 3
    tags: 531, strength
    exerciseSets: above 2 groups
*/

export interface IWorkoutExercise {
  exerciseId: number;
  name: string;
  // equipment: string;
  // capacityType: ExerciseCapacityType;
  capacity: string;
  repititions?: number;
  notes: string;
}

export interface IWorkoutGroup {
  description: string;
  exercises: IWorkoutExercise[];
  sets: number;
  notes?: string;
}

type IWorkoutUnit = IWorkoutGroup | IWorkoutExercise;

export interface IWorkout {
  id: number;
  description: string;
  exerciseSets: IWorkoutUnit[];
  tags: string[];
  notes: string;
  date: Date;
  originWorkoutId: number;
}

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
