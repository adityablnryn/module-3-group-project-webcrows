import React, { Component } from 'react';
import { Link } from 'react-router'
import request from 'superagent';
import Note from './Note';

var SearchBar = React.createClass({
  handleChange() {
    this.props.onUserInput(
      this.refs.filterTextInput.value,
    );
  },

render() {
  return (
    <form>
      <input
        type="text"
        placeholder="Tag Search..."
        value={this.props.filterText}
        ref="filterTextInput"
        onChange={this.handleChange}
      />
    </form>
    );
  }
})

var Board = React.createClass({
    getInitialState() {
        return {
            notes: [''], filterText: ''
        }
    },
    componentDidMount() {
      var self = this;
      request
       .get('/api/explore')
       .set('Accept', 'application/json')
       .end(function(err, res) {
         if (err || !res.ok) {
           console.log('Oh no! error', err);
         } else {
           self.setState({notes: res.body.allposts});
         }
       });
    },
    remove(id) {
        console.log('called remove function')
        // Ambuj start
        var self = this;
        request
         .get('/api/delete/'+id)
         .set('Accept', 'application/json')
         .end(function(err, res) {
           console.log('After API call')
           if (err || !res.ok) {
             console.log('Oh no! error', err);
           } else {
             console.log('Delete API call successfull ');
           }
         });
         // Ambuj end
        var notes = this.state.notes.filter(note => note.postId !== id)
        this.setState({notes})
    },
    eachNote(note) {
        return (<Note key={note.postId}
                      id={note.postId}
                      title={note.postTitle}
                      onRemove={this.remove}>
                  {note.postPic}
                </Note>)
    },
    handleUserInput(filterText) {
      this.setState({
        filterText: filterText,
      });
    },
    render() {
      var filteredNotes = []
      this.state.notes.forEach((note) => {
        var notevar = "" + note.postTag
        if (notevar.toLowerCase().indexOf(this.state.filterText.toLowerCase()) === -1) {
          return;
        }
        else {
          filteredNotes.push(note);
        }
      });
        return (
          <div>
          <br/>
          <SearchBar
            filterText={this.state.filterText}
            onUserInput={this.handleUserInput}
          />
            <div className="wrapper">
            <div className="columns">
            <div className='board'>
                   {filteredNotes.map(this.eachNote)}
                </div>
                </div>
                </div>
            </div>
                )
    }
})

export default Board;
