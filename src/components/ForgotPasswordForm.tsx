import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./ui/card.tsx";
import {AlertDestructive} from "./ui/alert-destructive.tsx";
import {Label} from "./ui/label.tsx";
import {Input} from "./ui/input.tsx";
import {Button} from "./ui/button.tsx";
import {Alert, AlertDescription, AlertTitle} from "./ui/alert.tsx";
import {AlertCircle} from "lucide-react";
import axios from "axios";
import {Textarea} from "./ui/textarea.tsx";
import {Link} from "react-router-dom";

const ForgotPasswordForm = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [password, setPassword] = useState('');

    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isPasswordReset, setIsPasswordReset] = useState(false);

    const handleSubmitGetPasswordResetCode = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:8080/api/v1/users/send-reset-password-token/email=${email}`);

            setSuccessMessage(response.data.message);
            setIsEmailSent(true);

            setTimeout(() => {
                setSuccessMessage('');
            }, 4000);
        }

        catch (error) {
            console.log(error);

            if (error.response) {
                setErrorMessage(error.response.data.message);
            }

            setTimeout(() => {
                setErrorMessage('');
            }, 4000);
        }
    }

    const handleSubmitResetPassword = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (!resetCode) {
            setErrorMessage('The password reset code is required');

            setTimeout(() => {
                setErrorMessage('');
            }, 4000);

            return;
        }

        else if (!password) {
            setErrorMessage('The password is required');

            setTimeout(() => {
                setErrorMessage('');
            }, 4000);

            return;
        }

        else if (password.length < 8) {
            setErrorMessage('The password must be at least 8 characters long');

            setTimeout(() => {
                setErrorMessage('');
            }, 4000);

            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8080/api/v1/users/reset-password/reset-password-token=${resetCode}`,
                password,
                {
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                }
            );

            setSuccessMessage(response.data.message);
            setIsPasswordReset(true);

            setTimeout(() => {
                setSuccessMessage('');
            }, 4000);
        }

        catch (error) {
            console.log(error);

            if (error.response) {
                setErrorMessage(error.response.data.message);
            }

            setTimeout(() => {
                setErrorMessage('');
            }, 4000);
        }
    }

    return (
        <>
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Forgot password</CardTitle>
                    <CardDescription className="text-center">
                        {isEmailSent ? 'Enter your password reset code below and your new password' : 'Enter your email below to send the code for resetting your password'}
                    </CardDescription>
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
                    {!isEmailSent ? (
                        <div className="grid gap-4">
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
                            <Button type="submit" onClick={handleSubmitGetPasswordResetCode} className="w-full">
                                Get your password reset code
                            </Button>
                        </div>
                    ) : (
                        !isPasswordReset ? (
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="code">Reset password code</Label>
                                    <Textarea
                                        id="code"
                                        rows={2}
                                        placeholder="Your password reset code sent on your email"
                                        onChange={e => setResetCode(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">New password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Your new password"
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" onClick={handleSubmitResetPassword} className="w-full">
                                    Reset your password
                                </Button>
                                <div className="mt-4 text-center text-sm">
                                    Didn't receive the password reset code at the previous step?{" "}
                                    <p onClick={handleSubmitGetPasswordResetCode}
                                       className="underline hover:cursor-pointer">
                                        Resend the code to your email
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <Link to="/sign-in">
                                <Button className="w-full outline">
                                    Go to sign in
                                </Button>
                            </Link>
                        )
                    )}
                </CardContent>
            </Card>
        </>
    );
};

export default ForgotPasswordForm;