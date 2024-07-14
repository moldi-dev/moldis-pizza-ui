import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./ui/card.tsx";
import {AlertDestructive} from "./ui/alert-destructive.tsx";
import {Eye, EyeOff} from "lucide-react";
import {Label} from "./ui/label.tsx";
import {Input} from "./ui/input.tsx";
import {Textarea} from "./ui/textarea.tsx";
import {Button} from "./ui/button.tsx";
import UserModel from "../models/UserModel.tsx";
import axios from "axios";
import {useNavigate} from "react-router-dom";

interface CompleteRegistrationOAuth2UserFormProps {
    accessToken: string | null;
    loggedInUser: UserModel | undefined;
}

const CompleteRegistrationOAuth2UserForm: React.FC<CompleteRegistrationOAuth2UserFormProps> = ({
                                                                                                   accessToken,
                                                                                                   loggedInUser
                                                                                               }) => {

    const [username, setUsername] = useState(loggedInUser?.username);
    const [firstName, setFirstName] = useState(loggedInUser?.firstName);
    const [lastName, setLastName] = useState(loggedInUser?.lastName);
    const [email, setEmail] = useState(loggedInUser?.email);
    const [address, setAddress] = useState(loggedInUser?.address);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    const handleFinishCreatingAccount = async () => {
        try {
            const response = await axios.patch(`http://localhost:8080/api/v1/users/complete-registration-oauth2-user/id=${loggedInUser?.userId}`, {
                username,
                firstName,
                lastName,
                email,
                address,
                password,
                confirmPassword
            }, {
                headers: {Authorization: `Bearer ${accessToken}`}
            });

            const accessTokenResponse = response.data.data.accessToken;
            const refreshToken = response.data.data.refreshToken;
            const rememberMeToken = response.data.data.rememberMeToken;

            localStorage.setItem('accessToken', accessTokenResponse);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('rememberMeToken', rememberMeToken);

            navigate("/pizzas");
        } catch (error) {
            console.log(error);

            if (error.response && error.response.status == 400) {
                setValidationErrors(error.response.data.data.validationErrors);
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

    useEffect(() => {
        setUsername(loggedInUser?.username);
        setFirstName(loggedInUser?.firstName);
        setLastName(loggedInUser?.lastName);
        setEmail(loggedInUser?.email);
        setAddress(loggedInUser?.address);
    }, [loggedInUser]);

    return (
        <>
            {loggedInUser &&
                <Card className="mx-auto max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-xl text-center">Complete your registration</CardTitle>
                        <CardDescription className="text-center">
                            Edit your information below to finish your Google registration
                        </CardDescription>
                        {validationErrors.length > 0 && validationErrors.map((error, index) => (
                            <AlertDestructive
                                key={index}
                                title="Error"
                                description={error}
                            />
                        ))}
                        {errorMessage && (
                            <AlertDestructive description={errorMessage} title="Error"/>
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
                                    defaultValue={loggedInUser.username}
                                    onChange={e => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="first-name">First name</Label>
                                    <Input
                                        id="first-name"
                                        type="text"
                                        placeholder="Your first name"
                                        defaultValue={loggedInUser.firstName}
                                        onChange={e => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last-name">Last name</Label>
                                    <Input
                                        id="last-name"
                                        type="text"
                                        placeholder="Your last name"
                                        defaultValue={loggedInUser.lastName}
                                        onChange={e => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Your email"
                                    defaultValue={loggedInUser.email}
                                    disabled
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    rows={3}
                                    placeholder="Your address"
                                    defaultValue={loggedInUser.address}
                                    onChange={e => setAddress(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Your password"
                                        onChange={e => setPassword(e.target.value)}
                                    />
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
                                    />
                                    <span onClick={toggleConfirmPasswordVisibility}
                                          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-muted-foreground h-10 w-8">
                                            {showConfirmPassword ? <Eye/> : <EyeOff/>}
                                        </span>
                                </div>
                            </div>
                            <Button type="submit" className="w-full" onClick={handleFinishCreatingAccount}>
                                Complete registration
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Your account's password will be used when updating your profile information
                        </div>
                    </CardContent>
                </Card>
            }
        </>
    );
};

export default CompleteRegistrationOAuth2UserForm;