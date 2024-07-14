import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./ui/card.tsx";
import {Label} from "./ui/label.tsx";
import {Input} from "./ui/input.tsx";
import {Button} from "./ui/button.tsx";
import {Link} from "react-router-dom";
import {AlertDestructive} from "./ui/alert-destructive.tsx";
import axios from "axios";
import {Alert, AlertDescription, AlertTitle} from "./ui/alert.tsx";
import {AlertCircle, Eye, EyeOff} from "lucide-react";
import {Textarea} from "./ui/textarea.tsx";

const SignUpForm = () => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    const [hasRegistrationSucceeded, setHasRegistrationSucceeded] = useState(false);
    const [hasVerificationSucceeded, setHasVerificationSucceeded] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    const handleResendConfirmationEmail = async (email: string) => {
        try {
            const response = await axios.post(`http://localhost:8080/api/v1/users/resend-confirmation-email/email=${email}`);

            setSuccessMessage(response.data.message);

            setTimeout(() => {
                setSuccessMessage('');
            }, 4000);
        } catch (error) {
            console.log(error);

            if (error.response && error.response.status == 400) {
                setErrorMessage(error.response.data.message);
            } else if (error.response && error.response.status == 409) {
                setErrorMessage(error.response.data.message);
            } else if (error.response) {
                setErrorMessage('An unexpected error has occurred. Please try again later!');
            }

            setTimeout(() => {
                setErrorMessage('');
                setValidationErrors([]);
            }, 4000);
        }
    }

    const handleCreateAccount = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/v1/authentication/sign-up', {
                username,
                firstName,
                lastName,
                email,
                address,
                password,
                confirmPassword
            });

            setSuccessMessage(response.data.message);
            setHasRegistrationSucceeded(true);

            setTimeout(() => {
                setSuccessMessage('');
            }, 4000);
        } catch (error) {
            console.log(error);

            if (error.response && error.response.status == 400) {
                setValidationErrors(error.response.data.data.validationErrors);
            } else if (error.response) {
                setErrorMessage(error.response.data.message);
            }

            setTimeout(() => {
                setErrorMessage('');
                setValidationErrors([]);
            }, 4000);
        }
    }

    const handleActivateAccount = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            const response = await axios.patch('http://localhost:8080/api/v1/users/verify', {
                verificationCode
            });

            setSuccessMessage(response.data.message);
            setHasVerificationSucceeded(true);

            setTimeout(() => {
                setSuccessMessage('');
            }, 4000);
        } catch (error) {
            console.log(error);

            if (error.response && error.response.status == 400) {
                setValidationErrors(error.response.data.data.validationErrors);
            } else if (error.response) {
                setErrorMessage(error.response.data.message);
            }

            setTimeout(() => {
                setErrorMessage('');
                setValidationErrors([]);
            }, 4000);
        }
    }

    return (
        <>
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl text-center">Sign Up</CardTitle>
                    <CardDescription className="text-center">
                        Enter your information to create an account
                    </CardDescription>
                    {validationErrors.length > 0 && validationErrors.map((error, index) => (
                        <AlertDestructive
                            key={index}
                            title="Error"
                            description={error}
                        />
                    ))}
                    {successMessage && (
                        <Alert variant="default">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{successMessage}</AlertDescription>
                        </Alert>
                    )}
                    {errorMessage && (
                        <AlertDestructive description={errorMessage} title="Error"/>
                    )}
                </CardHeader>
                <CardContent>
                    {!hasRegistrationSucceeded &&
                        <>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Your username"
                                        onChange={e => setUsername(e.target.value)}
                                        required/>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="first-name">First name</Label>
                                        <Input
                                            id="first-name"
                                            type="text"
                                            placeholder="Your first name"
                                            onChange={e => setFirstName(e.target.value)}
                                            required/>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="last-name">Last name</Label>
                                        <Input
                                            id="last-name"
                                            type="text"
                                            placeholder="Your last name"
                                            onChange={e => setLastName(e.target.value)}
                                            required/>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Your email"
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Textarea
                                        id="address"
                                        rows={3}
                                        placeholder="Your address"
                                        onChange={e => setAddress(e.target.value)}
                                        required/>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Your password"
                                            onChange={e => setPassword(e.target.value)}
                                            required/>
                                        <span onClick={togglePasswordVisibility}
                                              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-muted-foreground h-10 w-8">
                                            {showPassword ? <Eye/> : <EyeOff/>}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm password"
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            required/>
                                        <span onClick={toggleConfirmPasswordVisibility}
                                              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-muted-foreground h-10 w-8">
                                            {showConfirmPassword ? <Eye/> : <EyeOff/>}
                                        </span>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" onClick={handleCreateAccount}>
                                    Sign up
                                </Button>
                            </div>
                            <div className="mt-4 text-center text-sm">
                                Already have an account?{" "}
                                <Link to="/sign-in" className="underline">
                                    Sign in
                                </Link>
                            </div>
                        </>
                    }

                    {hasRegistrationSucceeded && !hasVerificationSucceeded &&
                        <>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="verificationCode">Verification Code</Label>
                                    <Textarea id="verificationCode" placeholder="Your verification code"
                                              onChange={e => setVerificationCode(e.target.value)}/>
                                </div>
                                <div className="grid gap-2">
                                    <Button onClick={handleActivateAccount} className="w-full">
                                        Activate your account
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-4 text-center text-sm">
                                Didn't receive the verification code at the previous step?{" "}
                                <p onClick={e => handleResendConfirmationEmail(email)}
                                   className="underline hover:cursor-pointer">
                                    Resend the verification code to your email
                                </p>
                            </div>
                        </>
                    }

                    {hasRegistrationSucceeded && hasVerificationSucceeded &&
                        <>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Link to="/sign-in">
                                        <Button type="submit" className="w-full">
                                            Back to sign in
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </>
                    }
                </CardContent>
            </Card>
        </>
    );
};

export default SignUpForm;