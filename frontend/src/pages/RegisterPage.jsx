import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Form from '../components/Form';
import Card from '../components/Card';
import Input from '../components/Input';
import SubmitButton from '../components/SubmitButton';
import LoginRegisterSwitch from '../components/LoginRegisterSwitch';

function RegisterPage({ onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setError('All fields are required.');
            return;
        }
        setError('');
        setLoading(true);
        
        const success = await register(name, email, password);
        
        if (!success) {
            setError('Registration failed. The email might already be in use.');
        }
        
        setLoading(false);
    };

  return (
    <Card title="Create Account">
        <Form onSubmit={handleSubmit} >
          <Input 
            type="text" 
            placeholder="Full Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
          />
          <Input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <SubmitButton 
            type="submit"
            disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
          </SubmitButton>
        </Form>
        
        <LoginRegisterSwitch
            text="Already have an account?"
            linkText="Sign In" 
            onClick={onSwitchToLogin} >
        </LoginRegisterSwitch>
    </Card>
  );
}

export default RegisterPage;