import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./ui/card.tsx";
import {AlertDestructive} from "./ui/alert-destructive.tsx";
import {Label} from "./ui/label.tsx";
import {Input} from "./ui/input.tsx";
import {Button} from "./ui/button.tsx";
import {Alert, AlertDescription, AlertTitle} from "./ui/alert.tsx";
import {AlertCircle, Eye, EyeOff} from "lucide-react";
import axios from "axios";
import {Textarea} from "./ui/textarea.tsx";
import {Link} from "react-router-dom";
import {Simulate} from "react-dom/test-utils";

const ForgotPasswordForm = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [validationErrors, setValidationErrors] = useState([]);

    const [email, setEmail] = useState('');
    const [resetPasswordCode, setResetPasswordCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isPasswordReset, setIsPasswordReset] = useState(false);

    const handleSubmitGetPasswordResetCode = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:8080/api/v1/users/send-reset-password-token`, {
                email
            });

            setSuccessMessage(response.data.message);
            setIsEmailSent(true);

            setTimeout(() => {
                setSuccessMessage('');
            }, 4000);
        }

        catch (error) {
            console.log(error);

            if (error.response && error.response.status == 400) {
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
    }

    const handleSubmitResetPassword = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:8080/api/v1/users/reset-password`, {
                    resetPasswordCode,
                    newPassword,
                    confirmNewPassword
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

            if (error.response && error.response.status == 400) {
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
    }

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
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
                    {validationErrors.length > 0 && validationErrors.map((error, index) => (
                        <AlertDestructive
                            key={index}
                            title="Error"
                            description={error}
                        />
                    ))}
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
                                        onChange={e => setResetPasswordCode(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="newPassword">New password</Label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="Your password"
                                            onChange={e => setNewPassword(e.target.value)}
                                            required/>
                                        <span onClick={toggleNewPasswordVisibility}
                                              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-muted-foreground h-10 w-8">
                                            {showNewPassword ? <Eye/> : <EyeOff/>}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword">Confirm new password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Your password"
                                            onChange={e => setConfirmNewPassword(e.target.value)}
                                            required/>
                                        <span onClick={toggleConfirmPasswordVisibility}
                                              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-muted-foreground h-10 w-8">
                                            {showConfirmPassword ? <Eye/> : <EyeOff/>}
                                        </span>
                                    </div>
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