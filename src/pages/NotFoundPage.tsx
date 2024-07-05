import React from 'react';
import {Link} from "react-router-dom";
import {X} from "lucide-react";

const NotFoundPage = () => {
    return (
        <>
            <div
                className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-md text-center">
                    <X width={300} height={300} className="mx-auto mb-6 text-red-500"/>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Sorry, we couldn't find the page you were looking for.
                    </h1>
                    <p className="mt-4 text-muted-foreground">
                        The page you requested may have been moved or deleted. Please check the URL or try navigating
                        from the
                        homepage.
                    </p>
                    <div className="mt-6">
                        <Link
                            to="/pizzas"
                            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            Go to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotFoundPage;