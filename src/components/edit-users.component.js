import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default class EditExercise extends Component {
  constructor(props) {
    super(props);

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeNews = this.onChangeNews.bind(this);
    this.onChangeGender = this.onChangeGender.bind(this);
    this.fileChangedHandler = this.fileChangedHandler.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      username: '',
      email: '',
      photo: '',
      gender: 'male',
      news: false,
      dob: new Date(),
    }
  }

  componentDidMount() {
    axios.get('http://localhost:5000/users/'+this.props.match.params.id)
      .then(response => {
        this.setState({
          username: response.data.username,
          email: response.data.email,
          photo: response.data.photo,
          gender: response.data.gender,
          news: response.data.news,
          dob: new Date(response.data.dob)
        })   
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    })
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    })
  }

  fileChangedHandler(e) {
    this.setState({
      photo: e.target.files[0]
    })
  }

  onChangeNews(e) {
    this.setState({
      news: !this.state.news
    })
  }
  
  onChangeGender(e) {
    this.setState({
      gender: e.target.value
    })
  }

  onChangeDate(date) {
    this.setState({
      date: date
    })
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      username: this.state.username,
      email: this.state.email,
      photo: this.state.photo,
      gender: this.state.gender,
      news: this.state.news,
      dob: new Date(this.state.dob)
    }

    axios.put('http://localhost:5000/users/' + this.props.match.params.id, user)
      .then(res => console.log(res.data));

    window.location = '/';
  }

  render() {
    return (
    <div>
      <h3>Edit User</h3>
      <form onSubmit={this.onSubmit}>
        <div className="form-group">
          <label>Username: </label>
          <input 
              type="text" 
              className="form-control"
              value={this.state.username}
              onChange={this.onChangeUsername}
              />
        </div>
        <div className="form-group"> 
          <label>Email: </label>
          <input  type="email"
              required
              className="form-control"
              value={this.state.email}
              onChange={this.onChangeEmail}
              />
        </div>
        <div className="form-group"> 
          <label>News: </label>
          <input type="checkbox" 
                checked={this.state.news}               
                className="form-control"
                onChange={this.onChangeNews} />
        </div>
        <div className="form-group"> 
          <label>Gender: </label>
          <select ref="userInput"
                required
                className="form-control"
                value={this.state.gender}
                onChange={this.onChangeGender}>
                  <option value="female"> Female</option>;
                  <option value="male"> Male</option>;
                  })
                }
            </select>
        </div>
        <div className="form-group">
          <label>Date of Birth: </label>
          <div>
            <DatePicker
              selected={this.state.dob}
              onChange={this.onChangeDate}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Picture: </label>
          <div>
            <input type="file" onChange={this.fileChangedHandler} accept=".jpg,.png,.jpeg"/>
          </div>
        </div>
        <div className="form-group">
          <input type="submit" value="Edit User Log" className="btn btn-primary" />
        </div>
      </form>
    </div>
    )
  }
}