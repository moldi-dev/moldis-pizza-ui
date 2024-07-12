import React, {useState} from 'react';
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {Button} from "./ui/button.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./ui/card.tsx";
import {Input} from "./ui/input.tsx";
import {Label} from "./ui/label.tsx";
import {AlertDestructive} from "./ui/alert-destructive.tsx";
import {Checkbox} from "./ui/checkbox.tsx";
import {Eye, EyeOff} from "lucide-react";

const SignInForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState('false');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const handleCheckboxChange: React.FormEventHandler<HTMLButtonElement> = (e) => {
        if (rememberMe === 'false') {
            setRememberMe('true');
        }

        else if (rememberMe === 'true') {
            setRememberMe('false');
        }
    };

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
            console.log(error);

            if (error.response && error.response.data.status === 'BAD_REQUEST') {
                setValidationErrors(error.response.data.data.validationErrors);
            }

            else if (error.response) {
                setErrorMessage(error.response.data.message);
            }

            setTimeout(() => {
                setErrorMessage('');
                setValidationErrors([]);
            }, 4000);
        }
    };

    return (
        <>
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Sign in</CardTitle>
                    <CardDescription className="text-center">
                        Enter your username and password below to sign in to your account
                    </CardDescription>
                    {errorMessage && (
                        <AlertDestructive description={errorMessage} title="Error" />
                    )}
                    {validationErrors.length > 0 && validationErrors.map((error, index) => (
                        <AlertDestructive
                            key={index}
                            title="Error"
                            description={error}
                        />
                    ))}
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Your username"
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link to="/forgot-password" className="ml-auto inline-block text-sm underline">
                                    Forgot your password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Your password"
                                    onChange={e => setPassword(e.target.value)}
                                    required />
                                <span onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-muted-foreground h-10 w-8">
                                        {showPassword ? <Eye /> : <EyeOff />}
                                </span>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <div className="flex gap-2 items-center">
                                <Checkbox
                                    id="rememberMe"
                                    name="rememberMe"
                                    onClick={handleCheckboxChange} />
                                <Label htmlFor="rememberMe">Remember me</Label>
                            </div>
                        </div>
                        <Button type="submit" className="w-full" onClick={handleSubmit}>
                            Sign in
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don't have an account?{" "}
                        <Link to="/sign-up" className="underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default SignInForm;
