import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      loading: false,
      loadedMovies: []
    };
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true })
    var page = 1;
    fetch(`https://jsonmock.hackerrank.com/api/movies/search?Title=${this.state.value}&page=${page}`)
    .then(resp => resp.json())
    .then(resp => {
      const arr = new Array(parseInt(resp.total_pages));
      Promise.all(arr.fill(1).slice(1).map((_, index) =>
        //We do this because we have already loaded the first page
        fetch(`https://jsonmock.hackerrank.com/api/movies/search?Title=${this.state.value}&page=${index + 2}`)
        .then(res => res.json())
      )).then(resp => resp.reduce((acc, val) => ([...acc, ...val.data]), []))
      .then(movies => this.setState({ loading: false, loadedMovies: [resp.data, ...movies] }))
    })
  }

  render() {
    const { value, loading, loadedMovies } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Movie Search</h1>
        </header>
        <form onSubmit={this.handleSubmit}>
          <label>
            Search for movie:
            <input type="text" value={value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <div>
          {!loading && loadedMovies.map((movie, index) => (
            <div key={index}>
              {movie.Title}
            </div>
          ))}
          {loading && (
            <div>Loading...</div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
