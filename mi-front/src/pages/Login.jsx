import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const onChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(form.email, form.password);
            navigate('/perfil');
        } catch {
            setError('No se pudo iniciar sesión');
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Iniciar sesión</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="Correo"
                required
            />

            <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                placeholder="Contraseña"
                required
            />

            <button type="submit">Ingresar</button>
            <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
        </form>
    );
}