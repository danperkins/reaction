import * as ReactDOM from 'react-dom';
import * as React from 'react';

import { ExercisePlannerApp } from './components/ExercisePlannerApp/ExercisePlannerApp';

declare var fetch;

ReactDOM.render(<ExercisePlannerApp />, document.getElementById('appRoot'));
