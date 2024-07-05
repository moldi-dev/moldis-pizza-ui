import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./ui/card.tsx";
import {Label} from "./ui/label.tsx";
import {Input} from "./ui/input.tsx";
import {Button} from "./ui/button.tsx";
import {Link} from "react-router-dom";
import {AlertDestructive} from "./ui/alert-destructive.tsx";
import axios from "axios";
import {Alert, AlertDescription, AlertTitle} from "./ui/alert.tsx";
import {AlertCircle} from "lucide-react";
import {Textarea} from "./ui/textarea.tsx";

const SignUpForm = () => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/v1/authentication/sign-up', {
                username,
                firstName,
                lastName,
                email,
                address,
                password
            })

            setSuccessMessage(response.data.message);

            setTimeout(() => {
                setSuccessMessage('');
            }, 4000);
        }

        catch (error) {
            console.log(error);

            if (error.response && error.response.status == 400) {
                setValidationErrors(error.response.data.data.validationErrors);
            }

            else if (error.response && error.response.status == 409) {
                setErrorMessage(error.response.data.message);
            }

            else if (error.response) {
                setErrorMessage('An unexpected error has occurred. Please try again later!');
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
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{successMessage}</AlertDescription>
                        </Alert>
                    )}
                    {errorMessage && (
                        <AlertDestructive description={errorMessage} title="Error" />
                    )}
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
                                required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input
                                    id="first-name"
                                    type="text"
                                    placeholder="Your first name"
                                    onChange={e => setFirstName(e.target.value)}
                                    required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input
                                    id="last-name"
                                    type="text"
                                    placeholder="Your last name"
                                    onChange={e => setLastName(e.target.value)}
                                    required />
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
                                required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Your password"
                                onChange={e => setPassword(e.target.value)}
                                required />
                        </div>
                        <Button type="submit" className="w-full" onClick={handleSubmit}>
                            Sign up
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link to="/sign-in" className="underline">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default SignUpForm;