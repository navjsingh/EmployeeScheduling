import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/Input';
import Card from '../components/Card';
import Form from '../components/Form';
import SubmitButton from '../components/SubmitButton';
import LoginRegisterSwitch from '../components/LoginRegisterSwitch';

function LoginPage({ onSwitchToRegister, onForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        const success = await login(email, password);
        
        if (!success) {
            setError('Invalid email or password.');
        }
        
        setLoading(false);
    };

  return (
    <Card title="Sign In">
        <Form onSubmit={handleSubmit} >
          <Input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => 
              setEmail(e.target.value)} />

          <Input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => 
              setPassword(e.target.value)} />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          {/*This one is only used once, so didn't make it external */} 
          <div className="flex items-center justify-between">
            <button 
              type="button" 
              onClick={onForgotPassword} 
              className="text-sm text-blue-600 cursor-pointer hover:underline">
                Forgot password?
            </button>
          </div>

          <SubmitButton 
            type="submit"
            disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
          </SubmitButton>

        </Form>
        <LoginRegisterSwitch
            text="Don't have an account?"
            linkText="Register" 
            onClick={onSwitchToRegister} >
        </LoginRegisterSwitch>
    </Card>
  );
}

export default LoginPage;