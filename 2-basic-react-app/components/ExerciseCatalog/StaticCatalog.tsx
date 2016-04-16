import { IExercise } from '../Exercise/Exercise';

export var StaticExerciseCatalog: IExercise[] = [
  {
    id: '1',
    name: 'Benchpress',
    description: 'Do a benchpress',
    muscleGroups: ['Chest', 'Triceps'],
    equipment: ['Barbell|Dumbbells', 'Bench']
  },
  {
    id: '2',
    name: 'Front Squat',
    description: 'Do a front squat',
    muscleGroups: ['Quads'],
    equipment: ['Barbell', 'Rack']
  },
  {
    id: '3',
    name: 'Deadlift',
    description: 'Do a deadlift',
    muscleGroups: ['Hamstrings', 'Quads'],
    equipment: ['Barbell']
  },
  {
    id: '4',
    name: 'Dips',
    description: 'Do a dip',
    muscleGroups: ['Chest', 'Back', 'Triceps'],
    equipment: ['Rack']
  },
  {
    id: '5',
    name: 'Kettlebell Swing',
    description: 'Do a Kettlebell swing',
    muscleGroups: ['Hamstrings', 'Core'],
    equipment: ['Kettlebell']
  },
  {
    id: '6',
    name: 'Overhead Press',
    description: 'Do an overhead press',
    muscleGroups: ['Shoulders', 'Triceps'],
    equipment: ['Bench', 'Barbell|Dumbbells']
  },
  {
    id: '7',
    name: 'Pullup',
    description: 'Do a pullup',
    muscleGroups: ['Back', 'Biceps'],
    equipment: ['Rack']
  }
];

export default StaticExerciseCatalog;
