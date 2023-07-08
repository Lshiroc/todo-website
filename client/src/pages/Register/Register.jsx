import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import validator from 'validator';
import style from './register.module.scss';

export default function Register() {
    const [error, setError] = useState("");
    const usernameInput = useRef();
    const emailInput = useRef();
    const passwordInput = useRef();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if(usernameInput.current.value.length == 0 || passwordInput.current.value.length == 0 || emailInput.current.value.length == 0) {
            setError("*Fields are empty");
            return false;  
        } else {
            setError("");
        }

        if(!validator.isEmail(emailInput.current.value)) {
            setError("*Email is incorrect");
            return false;
        }

        const requestBody = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameInput.current.value,
                mail: emailInput.current.value,
                password: passwordInput.current.value
            })
        }

        let loginData;

        loginData = await fetch(`https://todo-website-backend.vercel.app/users/register`, requestBody)
            .then(resp => resp.json())
            .then(data => data)
            .catch(err => setError("*Information is wrong"));
        if(loginData.userID) {
            navigate('/login', { replace: true });
        }

        usernameInput.current.value = "";
        emailInput.current.value = "";
        passwordInput.current.value = "";
    }

    return (
        <>
        <Helmet>
            <title>Register - Doin' It</title>
        </Helmet>
            <main className={style.main}>
                <h1 className={style.title}>Register</h1>
                <div className={style.content}>
                    <div className={style.item}>
                        <label className={style.label}>Username:</label>
                        <input type="text" autoComplete='off' name="username" ref={usernameInput} placeholder='xXx_Destroyer_xXx' />
                    </div>
                    <div className={style.item}>
                        <label className={style.label}>Email:</label>
                        <input type="text" autoComplete='off' name="email" ref={emailInput} placeholder='xxxdestroyerxxx@gmail.com' />
                    </div>
                    <div className={style.item}>
                        <label className={style.label}>Password:</label>
                        <input type="password" name="password" ref={passwordInput} placeholder='**********' />
                        <p className={style.error}>{error}</p>
                    </div>
                    <button className={style.loginBtn} onClick={() => handleLogin()}>Login</button>
                    <Link className={style.register} to="/login">Already registered?</Link>
                </div>
            </main>
        </>
    )
}