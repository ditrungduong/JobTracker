import React from 'react';

function Login({ password, setPassword, handleLogin, setChangingPassword, error }) {
    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Welcome to Job Tracker</h1>
                <p>Please login to access your dashboard.</p>

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                {error && <p className="error-message">{error}</p>}

                <div className="button-group">
                    <button onClick={handleLogin}>Login</button>
                    <button onClick={() => setChangingPassword(true)}>Change Password</button>
                </div>
            </div>
        </div>
    );
}

export default Login;