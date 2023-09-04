import React, { useState } from 'react';
import { signUp } from '../../Supabase/supabaseService';
import './SignUp.css';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await signUp(email, password);
        } catch (error) {

        }
    };

    return (
        <div className="signup-container">
            <form onSubmit={handleSignUp} className="signup-form">
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default SignUp;
