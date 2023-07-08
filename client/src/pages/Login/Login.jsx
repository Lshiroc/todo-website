import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import style from './login.module.scss';

export default function Login() {
    const [error, setError] = useState("");
    const usernameInput = useRef();
    const passwordInput = useRef();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if(usernameInput.current.value.length == 0 || passwordInput.current.value.length == 0) {
            setError("*Fields are empty");
            return false;  
        } else {
            setError("");
        }

        const requestBody = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameInput.current.value,
                password: passwordInput.current.value
            })
        }

        let loginData;

        loginData = await fetch(`http://127.0.0.1:8000/users/login`, requestBody)
            .then(resp => resp.json())
            .then(data => data)
            .catch(err => setError("*Information is wrong"));
        if(loginData.accessToken) {
            localStorage.setItem("token", loginData.accessToken);
            localStorage.setItem("username", usernameInput.current.value);
            localStorage.setItem("userID", loginData.userID);
            navigate('/dashboard', { replace: true });
        }

        usernameInput.current.value = "";
        passwordInput.current.value = "";
    }

    return (
        <>
        <Helmet>
            <title>Login - Doin' It</title>
        </Helmet>
            <main className={style.main}>
                <h1 className={style.title}>Login</h1>
                <div className={style.content}>
                    <div className={style.item}>
                        <label className={style.label}>Username:</label>
                        <input type="text" autoComplete='off' name="username" ref={usernameInput} placeholder='xXx_Destroyer_xXx' />
                    </div>
                    <div className={style.item}>
                        <label className={style.label}>Password:</label>
                        <input type="password" name="password" ref={passwordInput} placeholder='**********' />
                        <p className={style.error}>{error}</p>
                    </div>
                    <button class={style.loginBtn} onClick={() => handleLogin()}>Login</button>
                    <Link class={style.register} to="/register">Haven't registered?</Link>
                </div>
            </main>
        </>
    )
}