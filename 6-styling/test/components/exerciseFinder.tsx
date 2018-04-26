import * as chai from 'chai';
import * as React from 'react';
import * as enzyme from 'enzyme';
import * as sinon from 'sinon';
import { StaticExerciseCatalog } from '../helpers/StaticCatalog';
import { StaticWorkoutHistory } from '../helpers/StaticWorkoutHistory';
import { ExerciseFinder } from '../../components/ExerciseFinder/ExerciseFinder';
import { IWorkout } from '../../components/WorkoutHistory/WorkoutHistory';
import { ExerciseFilters, IExerciseFilterContainer } from '../../components/ExerciseFilters/ExerciseFilters';
import { ExerciseCatalog } from '../../components/ExerciseCatalog/ExerciseCatalog';
import * as axios from 'axios';

describe("ExerciseFinder component", () => {
    let xhr: sinon.SinonFakeXMLHttpRequest;
    let reqs: sinon.SinonFakeXMLHttpRequest[];

    beforeEach(() => {
        xhr = sinon.useFakeXMLHttpRequest();
        reqs = [];

        // Save the fake request so we can respond to it later
        xhr.onCreate = (fakeRequest: sinon.SinonFakeXMLHttpRequest) => {
            reqs.push(fakeRequest);
        };
    });

    afterEach(() => {
        xhr.restore();
    });

    it("should render ExerciseFilters and ExerciseCatalog", () => {
        let exerciseFinder = enzyme.shallow(
            <ExerciseFinder addNewWorkout={(w: any) => Promise.resolve({})} catalog={[]} />);
        let filters = exerciseFinder.find(ExerciseFilters);
        let catalog = exerciseFinder.find(ExerciseCatalog);

        chai.expect(filters.length, "should render filters component").to.be.equal(1);
        chai.expect(catalog.length, "should render catalog component").to.be.equal(1);
    });

    it("should clear workouts", () => {
        // Need to use 'mount' instead of shallow because of 'refs'
        let exerciseFinder = enzyme.mount(
            <ExerciseFinder addNewWorkout={(w: any) => Promise.resolve({})} catalog={[]} />);

        let workout: IWorkout = { id: '2', exercises: ['test Exercise', 'another Exercise'] };
        exerciseFinder.setState({ currentWorkout: workout });
        chai.expect(exerciseFinder.state().currentWorkout,
            "exercise finder state was updated").to.be.equal(workout);

        exerciseFinder.find('button.clearCurrentWorkout').simulate('click');

        chai.expect(exerciseFinder.state().currentWorkout, "workout cleared")
            .to.be.deep.equal({ id: null, notes: '', exercises: [] });
    });

    it('should add a workout to history', () => {
        let callback: sinon.SinonSpy;
        let testExercises = ['test Exercise'];
        let workout: IWorkout = { id: '3', exercises: testExercises };

        // testNotes are not included in the workout object -- they should be inserted by the component
        let testNotes = 'test notes';

        let promise = new Promise((resolve, reject) => {
            callback = sinon.spy((w: IWorkout) => {
                resolve();
                return Promise.resolve();
            });
        });
        let exerciseFinder = enzyme.mount(<ExerciseFinder addNewWorkout={callback} catalog={[]} />);
        let inst = exerciseFinder.instance() as ExerciseFinder;
        let logWorkoutSpy = sinon.spy(inst, 'logWorkoutCallback');

        exerciseFinder.find('.logWorkout').simulate('click');
        chai.expect(logWorkoutSpy.notCalled, 'No workout disables button and callback never happens').to.be.true;

        exerciseFinder.setState({ currentWorkout: workout });
        let notesInput = exerciseFinder.find('input.notes');
        notesInput.instance().value = testNotes;

        exerciseFinder.find('.logWorkout').simulate('click');
        chai.expect(logWorkoutSpy.calledOnce, 'Callback fires').to.be.true;

        return promise.then(() => {
            chai.expect(callback.calledOnce, 'Callback invoked one time').to.be.true;
            let callbackArgs = callback.args[0][0] as IWorkout;
            chai.expect(callbackArgs.notes, 'Workout passed to callback with test notes').to.be.equal(testNotes);
            chai.expect(callbackArgs.exercises, 'Workout passed to callback with exercises').to.be.equal(testExercises);
            chai.expect(exerciseFinder.state().currentWorkout.exercises, 'exercises are cleared').to.deep.equal([]);
        });
    });

    it('should not clear exercises on addNewWorkout error', () => {
        let callback: sinon.SinonSpy;
        let testExercises = ['test Exercise'];
        let workout: IWorkout = { id: '3', exercises: testExercises };

        let promise = new Promise((resolve, reject) => {
            callback = sinon.spy((w: IWorkout) => {
                resolve();
                return Promise.reject('Error adding workout');
            });
        });
        let exerciseFinder = enzyme.mount(<ExerciseFinder addNewWorkout={callback} catalog={[]} />);
        exerciseFinder.setState({ currentWorkout: workout });

        exerciseFinder.find('.logWorkout').simulate('click');

        return promise.then(() => {
            chai.expect(callback.calledOnce, 'Callback invoked one time').to.be.true;
            chai.expect(exerciseFinder.state().currentWorkout.exercises, 'exercises are not cleared').to.be.equal(testExercises);
        });
    });

    it('addExerciseToCurrentWorkout callback should update the state', () => {
        let exerciseFinder = enzyme.shallow(
            <ExerciseFinder addNewWorkout={(w: any) => Promise.resolve({})} catalog={StaticExerciseCatalog} />);
        let inst = exerciseFinder.instance() as ExerciseFinder;

        let ex1 = 'test exercise1';
        let ex2 = 'test exercise2'
        chai.expect(exerciseFinder.state().currentWorkout.exercises,
            'initial exercise list should be empty').to.deep.equal([]);
        inst.addExerciseToCurrentWorkout(ex1);
        inst.addExerciseToCurrentWorkout(ex2);
        chai.expect(exerciseFinder.state().currentWorkout.exercises,
            'current workout state is updated with new exercises').to.deep.equal([ex1, ex2]);
    });

    it('should filter exercises based on Filters', () => {
        let exerciseFinder = enzyme.shallow(
            <ExerciseFinder addNewWorkout={(w: any) => Promise.resolve({})} catalog={StaticExerciseCatalog} />);
        let filters: IExerciseFilterContainer = exerciseFinder.state().filters;
        let inst = exerciseFinder.instance() as ExerciseFinder;
        let allItems = inst.getFilteredItems();

        chai.expect(allItems.length, 'all items should be visible').to.equal(StaticExerciseCatalog.length);

        filters['equipment'].filters['Rack'] = false;
        chai.expect(inst.getFilteredItems().length, 'removing Rack filter should hide some items - its an AND filter').to.equal(4);

        filters['muscleGroups'].filters['Chest'] = false;
        chai.expect(inst.getFilteredItems().length, 'removing Chest filter should not hide items - its an OR filter').to.equal(4);

        filters['muscleGroups'].filters['Triceps'] = false;
        chai.expect(inst.getFilteredItems().length, 'removing Chest and Triceps filter should hide items').to.be.equal(3);
      });

      it('should filter exercises based on Search', () => {
        let exerciseFinder = enzyme.mount(
            <ExerciseFinder addNewWorkout={(w: any) => Promise.resolve({})} catalog={StaticExerciseCatalog} />);
        let inst = exerciseFinder.instance() as ExerciseFinder;
        let allItems = inst.getFilteredItems();
        chai.expect(allItems.length, 'all items should be visible').to.equal(StaticExerciseCatalog.length);

        let searchInput = exerciseFinder.find('input.search');
        searchInput.instance().value = 'b';
        searchInput.simulate('change');
        chai.expect(inst.getFilteredItems().length, 'search for "b" should hide some items').to.equal(2);

        searchInput.instance().value = 'd';
        searchInput.simulate('change');
        chai.expect(inst.getFilteredItems().length, 'search for "d" should hide different items').to.equal(3);
    });
});