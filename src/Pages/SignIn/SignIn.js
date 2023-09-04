import React, { useState } from 'react';
import { signIn } from '../../Supabase/supabaseService';
import './SignIn.css';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            await signIn(email, password);
        } catch (error) {

        }
    };

    return (
        <div className="signin-container">
            <form onSubmit={handleSignIn} className="signup-form">
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default SignIn;
