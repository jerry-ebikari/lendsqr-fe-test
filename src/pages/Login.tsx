import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.scss';

function getTargetInfo(ev: any) {
    let target = ev.target;
    return [target.name, target.value, target.validity.valid];
}

function Login() {
    const navigate = useNavigate();
    let [isPasswordVisible, setPasswordVisibility] = useState(false);
    let [emailValue, setEmailValue] = useState('');
    // For realtime validation
    let [passwordValid, setPasswordValid] = useState(false);
    let [emailValid, setEmailValid] = useState(false);
    let [emailBlurred, setEmailBlurred] = useState(false);
    let [passwordBlurred, setPasswordBlurred] = useState(false);
    const [open, setOpen] = useState(true);
    let togglePasswordVisibility = () => {
        setPasswordVisibility(prevState => !prevState);
    }
    const checkValidity = (name: string, isValid: boolean) => {
        name == "email" ? setEmailValid(isValid) : setPasswordValid(isValid);
    }
    const handleInput = (ev: any) => {
        let [name, value, isValid] = getTargetInfo(ev);
        setEmailValue(prevState => name == "email" ? value : prevState);
        checkValidity(name, isValid);
    }
    const handleBlur = (ev: any) => {
        let [name, value, isValid] = getTargetInfo(ev);
        name == "email" ? setEmailBlurred(true): setPasswordBlurred(true);
        checkValidity(name, isValid);
    }
    const login = (ev: any) => {
        ev.preventDefault()
        localStorage.setItem("isLoggedIn", "true");
        navigate("/")
    }

    const handleClose = () => {
        setOpen(false);
    }
    return (
        <div className='login-container'>
            <div className="pane"></div>
            <img src="/images/logo.svg" alt="logo" className='login-logo' />
            <div className='login-content-container flex align-center'>
                <form className='login-form' onSubmit={login}>
                    <h2 className='welcome-text header-text'>Welcome!</h2>
                    <p className='login-desc primary-text'>Enter details to login.</p>
                    <div className="field">
                        <input
                            type="email"
                            name='email'
                            placeholder='Email'
                            className={"login-input " + ((emailBlurred && !emailValid) ? "error" : "")}
                            onInput={handleInput}
                            onBlur={handleBlur}
                            required
                        />
                        {
                            emailBlurred && !emailValid && emailValue == "" ?
                            <span className='error-text'>Enter email address</span> : 
                            <></>
                        }
                        {
                            emailBlurred && !emailValid && emailValue != "" ?
                            <span className='error-text'>Enter a valid email address</span> : 
                            <></>
                        }
                    </div>
                    <div className="field">
                        <div className="password-field">
                            <input
                                type={isPasswordVisible ? 'text' : 'password'}
                                name="password"
                                placeholder='Password'
                                className={"login-input " + ((passwordBlurred && !passwordValid)? "error" : "")}
                                onInput={handleInput}
                                onBlur={handleBlur}
                                required
                            />
                            <span className='clickable show-text fs-12' onClick={togglePasswordVisibility}>
                                {isPasswordVisible ? 'hide' : 'show'}
                            </span>
                        </div>
                        {passwordBlurred && !passwordValid ? <span className='error-text'>Enter password</span> : <></>}
                    </div>
                    <a className='clickable forgot-password fs-12 fw-600'>forgot password?</a>
                    <button
                        type='submit'
                        className='clickable login-btn fs-14 fw-600'
                        disabled={!emailValid || !passwordValid}
                    >
                        Log in
                    </button>
                </form>
            </div>

        {/* INSTRUCTION DIALOG */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            <p style={{
                        textAlign: "center",
                        fontWeight: "600",
                        color: "#213F7D",
                        margin: "0",
                        fontSize: "20px"
                    }}>
                        Welcome!
                    </p>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            <p style={{
                        textAlign: "center",
                        fontWeight: "600",
                        margin: "0",
                        fontSize: "16px"
                    }}>
                    Enter any email address and password of your choosing
                </p> 
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <div className="flex justify-center align-center dialog-buttons">
              <button className='btn cancel-btn' onClick={handleClose} autoFocus>OK</button>
            </div>
          </DialogActions>
      </Dialog>
        </div>
    )
}

export default Login;