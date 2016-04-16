import * as ReactDOM from 'react-dom';
import * as React from 'react';
import * as wProps from './typings/WorkoutTypings.d.ts';

import { ExercisePlannerApp } from './components/ExercisePlannerApp/ExercisePlannerApp';

import './styles/styles.less';

ReactDOM.render(<ExercisePlannerApp />, document.getElementById('appRoot'));


//ReactDOM.render(<FCatalog catalog={fullcatalog} />, document.getElementById('appRoot'));
