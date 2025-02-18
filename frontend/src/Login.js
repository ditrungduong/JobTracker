import React from 'react';

function Login({ 
    email, setEmail, 
    password, setPassword, 
    handleLogin, handleRegister, 
    setChangingPassword, 
    isRegistering, setIsRegistering, 
    error 
}) {
    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Welcome to the Job Tracker</h1>
                <p>{isRegistering ? 'Create an account' : 'Please login to access your jobs dashboard'}</p>

                <div className="form-group">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                    />
                    
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        onKeyDown={(e) => e.key === 'Enter' && (isRegistering ? handleRegister() : handleLogin())}
                    />
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="button-group">
                    <button onClick={isRegistering ? handleRegister : handleLogin}>
                        {isRegistering ? 'Register' : 'Login'}
                    </button>
                    {!isRegistering && (
                        <button onClick={() => setChangingPassword(true)}>Change Password</button>
                    )}
                </div>

                <p onClick={() => setIsRegistering(!isRegistering)} className="toggle-link">
                    {isRegistering ? 'Already have an account? Login here' : 'No account? Register here'}
                </p>
            </div>
        </div>
    );
}

export default Login;