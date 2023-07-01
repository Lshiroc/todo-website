import { useState, useRef } from 'react';

export default function Login() {
    const usernameInput = useRef();
    const passwordInput = useRef();

    const handleLogin = () => {
        if(usernameInput.current.value.length == 0 || passwordInput.current.value.length == 0) return false;

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

        fetch('http://127.0.0.1:8000/users/login', requestBody)
            .then(resp => resp.json())
            .then(data => console.log(data))
            .catch(err => console.error(err));

        usernameInput.current.value = "";
        passwordInput.current.value = "";
    }

    return (
        <>
            <h1>Login Page</h1>
            <input type="text" name="username" ref={usernameInput} placeholder='username' /><br/>
            <input type="password" name="password" ref={passwordInput} placeholder='password' /><br/>
            <button onClick={() => handleLogin()}>Login</button>
        </>
    )
}