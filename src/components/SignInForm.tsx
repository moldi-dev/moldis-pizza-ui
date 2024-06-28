import { useState } from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";

const SignInForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState('false');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/v1/authentication/sign-in', {
                username,
                password,
                rememberMe
            });

            const accessToken = response.data.data.accessToken;
            const refreshToken = response.data.data.refreshToken;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            if (rememberMe === 'true') {
                const rememberMeToken = response.data.data.rememberMeToken;
                localStorage.setItem('rememberMeToken', rememberMeToken);
            }

            navigate("/pizzas");
        }

        catch (error) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (error.response && error.response.status === 404) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                setErrorMessage(error.response.data.message);
            }

            else {
                setErrorMessage('An unexpected error occurred, please try again later');
            }

            setTimeout(() => {
                setErrorMessage('');
            }, 2500);
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center align-items-center">
            <div className="w-50">
                <h2 className="mb-4">Sign in</h2>
                <form onSubmit={handleSubmit}>
                    {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div>
                    )}
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-check mb-3">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="rememberMe"
                            checked={rememberMe === 'true'}
                            onChange={(e) => setRememberMe(e.target.checked ? 'true' : 'false')}
                        />
                        <label className="form-check-label" htmlFor="rememberMe">
                            Remember me
                        </label>
                    </div>
                    <button type="submit" className="btn btn-outline-danger">Sign In</button>
                    <div className="mb-3" style={{ paddingTop: "10px" }}>
                        <a href="/sign-up">Don't have an account? Sign up.</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignInForm;
