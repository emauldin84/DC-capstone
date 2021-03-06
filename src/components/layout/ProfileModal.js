import React from 'react';
import { Modal, } from 'react-materialize';
import axios from 'axios';

export default class ProfileModal extends React.Component{
  constructor(props){
    super(props);
    const { firstName, lastName, email, photoURL, } = this.props.user;
    this.state = {
      firstName, 
      lastName, 
      email, 
      photoURL,
      newPassword : null,
      fileName : null,
      photoFormData : null,
      latestPhotoURL : photoURL || null,
      tooltipShouldShow : false,
    };
  }
  componentWillUnmount(){
    clearTimeout(this.setTimeout);
    clearTimeout(this.autoSave);
  }
  render(){
    const {user} = this.props;
    const photo = this.state.latestPhotoURL? this.state.latestPhotoURL : this.state.photoURL;
    const options = {onCloseStart : this._saveChanges};
    return(
      <Modal id={"profile"}  options={options}>
        <div className="profile-modal">
          <div id='saving'>
            <p>Saving changes...</p>
          </div>
            <div className="profile-top-row">
                <div className="profile-picture-frame" onClick={this._choosePicture} onMouseEnter={this._showPhotoInput} onMouseLeave={this._hidePhotoInput} >
                      {photo?
                        <img alt="" src={`photos/${photo}`} ></img>
                      :
                        <p>{`${this.state.firstName[0]}${this.state.lastName[0]}`}</p>
                      }
                      <div className="fileupload-wrapper">
                        <input type="file" id="pictureinput" onChange={this._changeFileName} accept="image/png, image/jpeg, image/jpg, image/gif" />
                      </div>
                      <div className="fileupload-icon">
                        <i className="material-icons">add</i>
                      </div>
                </div>
                
                  <span id="phototip" onClick={this._undoPhoto} className={!this.state.tooltipShouldShow? "grey darken-3 tooltip-hidden" : "grey darken-3 profile-tool-tip" }>Undo?</span>
                <h3 className='user-name'>
                  <div id="firstName" onBlur={this._updateField} contentEditable={true} suppressContentEditableWarning={true}>{user.firstName}</div>
                  <div>&nbsp;</div>
                  <div id="lastName" onBlur={this._updateField}  contentEditable={true} suppressContentEditableWarning={true}>{user.lastName}</div>
                </h3>
                
            </div>
            <div className="profile-second-row">
              <h5 id="email" onBlur={this._updateField}  contentEditable={true} suppressContentEditableWarning={true}>
                      {user.email}
              </h5>
                <button className='btn change-password-button' onClick={this._showPasswordCheck}>
                    ChangePassword
                </button>
                  <input id="oldpassword"  type="password" data-password className="old-password-input password-fields" placeholder='Enter Old Password' onFocus={this._attachListener} onBlur={(e) => {this._detachListener(e); this._checkPassword();}}></input>
                  <input id="newpassword1" type="password" data-password className="new-password-input password-fields" placeholder='Enter New Password' onFocus={this._attachListener} onBlur={(e) => {this._detachListener(e); this._showNewPassword2();}}></input>
                  <input id="newpassword2" type="password" data-password className="new-password-input password-fields" placeholder='Enter New Password Again' onFocus={this._attachListener} onBlur={(e) => {this._detachListener(e); this._compareTwoPasswords();}}></input>
                
            </div>
        </div>
      </Modal>
      )
  }
  _updateField = ({target}) => {
    this.setState({
      [target.id] : target.textContent
    },
    this._showSaving)
  }
  _saveChanges = async () => {
    const passwords =  document.querySelectorAll("[data-password]")
    passwords.forEach(password => {
      password.style="visibility: hidden;"
      password.value=""
    })
    this.setState({tooltipShouldShow : false})
    const { firstName, lastName, email, photoURL, newPassword, latestPhotoURL, } = this.state
    const body = { 
      firstName, 
      lastName, 
      email,
      photoURL : latestPhotoURL, 
    }
    if (newPassword){
      await axios.post('/users/password', {password : newPassword})
    }
    if((firstName!==this.props.firstName)||(lastName!==this.props.lastName)||(email!==this.props.email)||(photoURL!==this.props.photoURL)||(newPassword!==null)){
        (this._showSaving())
        await axios.post(`/users`, body)
        this.props.updateLanding()
    }
  }
  _showPasswordCheck = () => {
    const oldPassword = document.getElementById("oldpassword");
    oldPassword.style="visibility: visible;"
    oldPassword.addEventListener('keypress', this._listenForEnter);
    oldPassword.focus() 
  }
  _checkPassword = async () => {
    const password = document.getElementById("oldpassword").value
    const {data} = await axios.post('/signin', {email: this.props.user.email, password})
    if(data.id){
      document.getElementById("oldpassword").removeEventListener('keypress', this._listenForEnter)
      this._showNewPassword1()
    }
    else if(data.status === 401){
      document.getElementById("profile").classList.add("shake")
      this.setTimeout = setTimeout(()=>{document.getElementById("profile").classList.remove("shake")}, 830)
    }
  }
  _compareTwoPasswords = () => {
    const oldPassword = document.getElementById("oldpassword");
    const firstPassword = document.getElementById("newpassword1").value
    const secondPassword = document.getElementById("newpassword2").value
    if (firstPassword === secondPassword){
      this.setState({newPassword:secondPassword},
        this._showSaving(),
        oldPassword.style="visibility: hidden;",
        oldPassword.value= '',
        document.getElementById("newpassword1").style="visibility: hidden;",
        document.getElementById("newpassword1").value= '',
        document.getElementById("newpassword2").style="visibility: hidden;",
        document.getElementById("newpassword2").value= '',
        )
    }
    else{
      document.getElementById("profile").classList.add("shake")
      setTimeout(()=>{document.getElementById("profile").classList.remove("shake")}, 830)
    }
  } 

  _showNewPassword1 = () => {
    const newPassword = document.getElementById("newpassword1")
    newPassword.style="visibility: visible;"
    newPassword.focus()
  }
  _showNewPassword2 = () => {
    const newPassword = document.getElementById("newpassword1")
    const newPassword2 = document.getElementById("newpassword2")
    if(newPassword.value){
      newPassword2.style="visibility: visible;"
      newPassword2.focus()
    }else{
      newPassword2.style="visibility: hidden;"
      newPassword.focus()
    }
  }

  _attachListener = (e) => {
    (e.target).addEventListener('keypress', this._listenForEnter)
  }
  _detachListener = (e) => {
    (e.target).removeEventListener('keypress', this._listenForEnter)
  }

  _listenForEnter = (e) => { 
    if (e.keyCode === 13){
      console.log(e.srcElement.id);
      if(e.srcElement.id === "oldpassword"){
        this._checkPassword();
      }
      else if (e.srcElement.id === "newpassword1"){
        this._showNewPassword2()
      }
      else if (e.srcElement.id === "newpassword2"){
        this._compareTwoPasswords()
      }
    }
  }
  _changeFileName = (e) => {
    if(e.target.files[0]){
      this.setState({
        fileName:e.target.files[0]
      },() => {this._uploadFile(this.state.fileName)})
    }
  }
  _uploadFile = (file) => {
    let formData = new FormData();
    formData.append('file',file)
    const photoFormData = formData
    this.setState({
        photoFormData
    }, async () => {
      const {data} = await axios.post('/users/profilepic', this.state.photoFormData, {headers:{'content-type':'multipart/form-data'}} )
      const latestPhotoURL = data.newPic[0].photo_url
      this.setState({latestPhotoURL, tooltipShouldShow:true,})
    },
    this._showSaving())
  }

  _choosePicture = () => {

  }

  _showPhotoInput = () => {
    document.getElementsByClassName("fileupload-icon")[0].style="opacity: 1;"
  }
  _hidePhotoInput = () => {
    document.getElementsByClassName("fileupload-icon")[0].style="opacity: 0;"
  }
  _undoPhoto = async() => {
    const {data} = await axios.post('/users/profilepic/undo', {url: this.state.photoURL})
    const latestPhotoURL = data.newPic[0].photo_url
    this.setState({latestPhotoURL}, () => {
      this.setState({tooltipShouldShow:false, fileName:null})
      let input = document.getElementById("pictureinput")
      input.value = null
    },
    this._showSaving())
  }

  _showSaving = () => {
    const { firstName, lastName, email, photoURL, newPassword, } = this.state

    if((newPassword || firstName!==this.props.firstName) || (lastName!==this.props.lastName) || (email!==this.props.email) || (photoURL!==this.props.photoURL) || (newPassword!==null)){
      document.getElementById('saving').style.display='inline';
      this.autoSave = setTimeout(function () {document.getElementById('saving').style.display='none'}, 1000);
    }
  }


}




