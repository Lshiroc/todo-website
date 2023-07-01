import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [data, setData] = useState("");
    const usernameInput = useRef();
    const passwordInput = useRef();
    const navigate = useNavigate();

    const handleLogin = async () => {
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

        let loginData;

        loginData = await fetch('http://127.0.0.1:8000/users/login', requestBody)
            .then(resp => resp.json())
            .then(data => data)
            .catch(err => console.error(err));
        if(loginData.accessToken) {
            localStorage.setItem("token", loginData.accessToken);
            localStorage.setItem("username", usernameInput.current.value);
            localStorage.setItem("userID", loginData.userID);
        }

        usernameInput.current.value = "";
        passwordInput.current.value = "";
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            // navigate('/', { replace: true });
        }
    }, [])

    return (
        <>
            <h1>Login Page</h1>
            <input type="text" name="username" ref={usernameInput} placeholder='username' /><br/>
            <input type="password" name="password" ref={passwordInput} placeholder='password' /><br/>
            <button onClick={() => handleLogin()}>Login</button>
        </>
    )
}