import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Spinner } from '../components/Spinner';
// In a real app, you would have API calls here, e.g., import * as api from '../utils/api';

export const ForgotPasswordPage: React.FC = () => {
    const [step, setStep] = useState<'find' | 'success'>('find');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFindAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        // Simulate API call to request a password reset email
        setTimeout(() => {
            if (email.includes('@')) {
                // api.requestPasswordReset(email).then(() => setStep('success')).catch(err => setError(err.message));
                console.log(`Password reset requested for ${email}`);
                setStep('success');
            } else {
                setError('Please enter a valid email address.');
            }
            setLoading(false);
        }, 1000);
    };

    const renderFindStep = () => (
        <>
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Reset Your Password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter your account's email address and we will send you a password reset link.
                </p>
            </div>
            <div className="bg-white p-8 shadow-lg rounded-lg mt-8">
                <form className="space-y-6" onSubmit={handleFindAccount}>
                    <div>
                        <label htmlFor="email">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm mt-1"
                            placeholder="Email address"
                        />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Spinner /> : 'Send Reset Link'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
    
    const renderSuccessStep = () => (
         <>
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Check Your Email
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    We've sent a password reset link to <span className="font-medium">{email}</span>. Please check your inbox and follow the instructions.
                </p>
            </div>
            <div className="mt-8">
                 <Link to="/login" className="w-full">
                    <Button className="w-full">
                        Return to Sign In
                    </Button>
                </Link>
            </div>
        </>
    );

    return (
        <div className="flex items-center justify-center min-h-[70vh] bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {step === 'find' ? renderFindStep() : renderSuccessStep()}
            </div>
        </div>
    );
};
