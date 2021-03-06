import React, { Component } from 'react'

export default class Register extends Component {
    state = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        console.log(this.state)
        
    }

    render() {
        return (
        <div className='container'>
            <form onSubmit={this.handleSubmit} className='white'>
                <h5 className='grey-text text-darken-3'>Register</h5>
                <div className='input-field'>
                    <label htmlFor='email'>Email</label>
                    <input type='email' id='email' required onChange={this.handleChange} />
                </div>
                <div className='input-field'>
                    <label htmlFor='password'>Password</label>
                    <input type='password' id='password' required  onChange={this.handleChange} />
                </div>
                <div className='input-field'>
                    <label htmlFor='firstName'>First Name</label>
                    <input type='text' id='firstName' required  onChange={this.handleChange} />
                </div>
                <div className='input-field'>
                    <label htmlFor='lastName'>Last Name</label>
                    <input type='text' id='lastName' required  onChange={this.handleChange} />
                </div>
                <div className='input-field'>
                    <button className='btn teal lighten-1 z-depth-0'>Sign Up</button>
                </div>
            </form>
            
        </div>
        )
    }
}
