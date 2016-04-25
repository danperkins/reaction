import * as React from 'react';
import { Exercise, IExercise } from '../Exercise/Exercise';

import './ExerciseCatalog.less';

interface CatalogProps {
  catalog: IExercise[];
  addExerciseCallback: (id: string) => void;
}

interface ExerciseProps {
  exercise: IExercise;
}

export function ExerciseCatalog(props: CatalogProps) {
  return (
    <div className="exerciseCatalog">
        {props.catalog.map((e) => <Exercise key={e.id} exercise={e} addExerciseCallback={() => props.addExerciseCallback(e.name)} />)}
    </div>
  );
}

export default ExerciseCatalog
