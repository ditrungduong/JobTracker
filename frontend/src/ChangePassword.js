import React from 'react';

function ChangePassword({
    email,
    setEmail,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    handlePasswordChange,
    setChangingPassword,
    error,
    success,
}) {
    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Change Your Password</h1>
                <p>Please verify your email and current password, then enter a new one.</p>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                />

                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    onKeyDown={(e) => e.key === 'Enter' && handlePasswordChange()}
                />

                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    onKeyDown={(e) => e.key === 'Enter' && handlePasswordChange()}
                />

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <div className="button-group">
                    <button onClick={handlePasswordChange}>Submit</button>
                    <button onClick={() => setChangingPassword(false)}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
