
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-[60vh] bg-white flex flex-col justify-center items-center text-center py-20 px-4 sm:px-6 lg:px-8">
            <p className="text-base font-semibold text-accent uppercase tracking-wide">404 error</p>
            <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Page not found</h1>
            <p className="mt-2 text-base text-gray-500">Sorry, we couldn’t find the page you’re looking for.</p>
            <div className="mt-6">
                <Link to="/">
                    <Button>Go back home</Button>
                </Link>
            </div>
        </div>
    );
};
