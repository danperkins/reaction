import * as React from 'react';
import * as axios from 'axios';

import './WorkoutHistory.less';

export interface IWorkout {
  id: string;
  exercises: string[];
  notes?: string;
  date?: number;
}

export interface IWorkoutHistoryProps {
  workouts: IWorkout[];
  deleteWorkout: (w: IWorkout) => void;
}

interface Counter {
  count: number;
}

export class WorkoutHistory extends React.Component<IWorkoutHistoryProps, any> {
  private val1 = null;
  private artist = null;
  constructor() {
    super();
    this.state = {
      relatedArtists: null,
      e: null
    }
  }

  render() {
    let workoutItems = this.props.workouts.map((w, i) => {
        return (
          <div className='workout' key={i}>
            <div>Exercises: {w.exercises.join(', ')}</div>
            <div>Notes: {w.notes}</div>
            <div>Date: {w.date}</div>
            <div className='deleteBtn' onClick={() => this.props.deleteWorkout(w)}>x</div>
          </div>
        );
    });

    let add = (n: number) => (x: number) => x + n;
    let multiply = (n: number) => (x: number) => x*n;
    let modTest = (n: number) => (x: number) => {
      if ((x % n) === 0)
        return x;
      else 
        throw new Error(x + ' not divisible by ' + n);
    };
    let nullRef = () => { let x = null as any; return x.bar; };
    let delay = (x: number) => new Promise<number>((resolve, reject) => { 
      window.setTimeout(() => { resolve(x);}, 1000)
    });
    let rejectedPromise = (e: any) => Promise.reject(e);
    let resolvedPromise = (x: any) => Promise.resolve(x);
    let identity = (x: any) => x;
    let log = (x: any) => { console.log(x); return x };
    let logError = (e: any) => { console.log('Error ' + e) };

    let error = () => Promise.resolve(nullRef())
      .then(log)
      .catch(logError);

    let caughtError = () => Promise.resolve()
      .then(() => nullRef())
      .then(log)
      .catch(logError);
    
    let mod3Test = () => resolvedPromise(this.val1)
      .then(modTest(3))
      .then(log);

    let mod3TestWithCatch = () => resolvedPromise(this.val1)
      .then(modTest(3))
      .then(log)
      .catch(logError);

    let getRelatedArtistWrapper = (p) => () => {
      Promise.resolve()
        .then(p)
        .then((related) => {
          this.setState({
            relatedArtists: related
          });
        })
        .catch((e) => {
          this.setState({
            relatedArtists: null,
            error: e.message ? JSON.stringify(e.message) : JSON.stringify(e)
          })
        })
    }

    let goodArtists = () => resolvedPromise(this.artist)
      .then((q) => {
        return axios.get('https://api.spotify.com/v1/search?q=' + q + '&type=artist');
      })
      .then((res) => {
        return (res.data as any).artists.items[0].id;
      })
      .then((id) => {
        return axios.get('https://api.spotify.com/v1/artists/' + id + '/related-artists');        
      })
      .then((res) => {
        let artists = (res.data as any).artists;
        return artists.slice(0,5).map((relatedArtist) => {
          return {
            name: relatedArtist.name,
            image: relatedArtist.images[0].url
          }
        })
      })
 
    let badArtists = () => new Promise((resolve, reject) => {
      let q = this.artist;
      axios.get('https://api.spotify.com/v1/search?q=' + q + '&type=artist')
        .then((res) => {
          let id = (res.data as any).artists.items[0].id;
          axios.get('https://api.spotify.com/v1/artists/' + id + '/related-artists')
            .then((res) => {
              let artists = (res.data as any).artists;
              resolve(artists.slice(0,5).map((relatedArtist) => {
                return {
                  name: relatedArtist.name,
                  image: relatedArtist.images[0].url
                }
              }))
            })
            .catch((e) => reject(e))
        })
        .catch((e) => reject(e))
    });

    let delayed = () => Promise.resolve(this.val1)
      .then(delay)
      .then(add(4))
      .then(modTest(2))
      .then(log)
      .then(delay)
      .then(multiply(3))
      .then(modTest(18))
      .then(log)

    let badDelayed = () => new Promise((resolve, reject) => {
      let val = this.val1;
      delay(val)
        .then((x) => {
          val = add(4)(x);
          modTest(2)(val);
          log(val);
          delay(val)
            .then((x) => {
              val = multiply(3)(x);
              val = modTest(18)(val);
              log(val);
              resolve(val);
            })
          .catch((e) => reject('failed second test'))
        })
        .catch((e) => reject('failed first test'))
    });

    let badDelayed2 = () => new Promise((resolve, reject) => {
      let val = this.val1;
      delay(val).then((x) => {
        val = add(4)(x);
        modTest(2)(val);
        log(val);
        delay(val).then((x) => {
          val = multiply(3)(x);
          val = modTest(18)(val);
          log(val);
          resolve(val);
        })
        .catch((e) => reject(e))
      })
    });

    let badDelayed3 = () => new Promise((resolve, reject) => {
      let val = this.val1;
      delay(val).then((x) => {
        val = add(4)(x);
        modTest(2)(val);
        log(val);
        delay(val).then((x) => {
          val = multiply(3)(x);
          val = modTest(18)(val);
          log(val);
          resolve(val);
        })
      })
      .catch((e) => reject(e))
    });

    let singlePromise = () => new Promise((resolve, reject) => {
      let start = 2;
      start = add(2)(start);
      start = add(2)(start);
      start = add(2)(start);
      start = add(2)(start);
      start = add(2)(start);
      start = add(2)(start);
      start = add(2)(start);
      start = add(2)(start);
      start = add(2)(start);
      start = add(2)(start);      
      start = add(2)(start);
      start = add(2)(start);
      start = add(2)(start);
      start = add(2)(start);
      start = add(2)(start);
      start = add(2)(start);
      start = add(2)(start);
      start = add(2)(start);
      start = add(2)(start);
      start = add(2)(start);
      resolve(start);
    });

    let manyPromises = () => Promise.resolve(2)
      .then(add(2))
      .then(add(2))
      .then(add(2))
      .then(add(2))
      .then(add(2))
      .then(add(2))
      .then(add(2))
      .then(add(2))
      .then(add(2))
      .then(add(2))
      .then(add(2))
      .then(add(2))
      .then(add(2))
      .then(add(2))
      .then(add(2))
      .then(add(2))
      .then(add(2))
      .then(add(2))
      .then(add(2))
      .then(add(2))

    let time = (p: any) => () => {
      let time = window.performance.now();
      Promise.resolve()
        .then(p)
        .then((v) => {
          console.log('final val ' + v);
          console.log('time: ' + (window.performance.now() - time));
        })
    }

    let wrap = (p: any) => () => {
      Promise.resolve()
        .then(p)
        .then(log)
        .catch((v) => {
          logError(v);
        })
    };

    let change = (x: any) => {
      this.val1 = parseInt(x.target.value);
      console.log(this.val1);
    };

    let change2 = (x: any) => {
      this.artist = x.target.value;
      console.log(this.artist);
    }; 

    return (
      <div className="workoutHistory">
        <div>
          <h2>Promises</h2>
          <span>VAL</span><input type='text' onChange={change} />
          <button onClick={error}>Error</button>
          <button onClick={caughtError}>CaughtError</button>
          <button onClick={wrap(delayed)}>Delayed</button>
          <button onClick={wrap(badDelayed)}>BadDelayed</button>
          <button onClick={wrap(badDelayed2)}>BadDelayed2</button>
          <button onClick={wrap(badDelayed3)}>BadDelayed3</button>
          <button onClick={mod3Test}>Mod 3 Test</button>
          <button onClick={mod3TestWithCatch}>Mod 3 Test With Catch</button>
          <button onClick={time(manyPromises)}>Many</button>
          <button onClick={time(singlePromise)}>Single</button>
        </div>
        <div>
          <h2>Artists</h2>
          <span>Query</span><input type='text' onChange={change2} />
          <button onClick={getRelatedArtistWrapper(goodArtists)}>Artists</button>
          <button onClick={getRelatedArtistWrapper(badArtists)}>BadArtists</button>
          {
            this.state.relatedArtists ? (
              <div>
                { 
                  this.state.relatedArtists.map((r) => {
                    let style = { 
                      backgroundImage: "url(" + r.image + ")"
                    };
                    return <div>
                      <div className="name">{r.name}</div>
                      <div style={style} />
                    </div>
                  })
                }
              </div>
            ) : (
              <div>
                { this.state.error ? this.state.error : 'No related artists found' }
              </div>
            )
          }
        </div>
        <div><h2>Workout History</h2></div>
        {workoutItems}
      </div>

    );
  }
}
