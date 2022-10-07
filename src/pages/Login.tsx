import React, { useState } from 'react';
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
    return (
        <div className='container'>
            <img src="images/logo.svg" alt="logo" className='logo' />
            <div className='content-container'>
                <form className='login-form'>
                    <h2 className='welcome-text'>Welcome!</h2>
                    <p className='login-desc'>Enter details to login.</p>
                    <div className="field">
                        <input
                            type="email"
                            name='email'
                            placeholder='Email'
                            className={(emailBlurred && !emailValid) ? "error" : ""}
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
                                className={(passwordBlurred && !passwordValid)? "error" : ""}
                                onInput={handleInput}
                                onBlur={handleBlur}
                                required
                            />
                            <span className='clickable show-text' onClick={togglePasswordVisibility}>
                                {isPasswordVisible ? 'hide' : 'show'}
                            </span>
                        </div>
                        {passwordBlurred && !passwordValid ? <span className='error-text'>Enter password</span> : <></>}
                    </div>
                    <a className='clickable forgot-password'>forgot password?</a>
                    <button
                        type='button'
                        className='clickable login-btn'
                        onClick={() => {navigate("/dashboard")}}
                        disabled={!emailValid || !passwordValid}
                    >
                        Log in
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login;