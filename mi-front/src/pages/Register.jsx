import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrar } from '../services/auth';

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
    const [error, setError] = useState('');

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await registrar(form);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'No se pudo registrar');
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Crear cuenta</h1>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <p><input name="name" value={form.name} onChange={onChange} placeholder="Nombre" required /></p>
            <p><input name="email" type="email" value={form.email} onChange={onChange} placeholder="Correo" required /></p>
            <p><input name="phone" value={form.phone} onChange={onChange} placeholder="Telefono" required /></p>
            <p><input name="password" type="password" value={form.password} onChange={onChange} placeholder="Contraseña" required /></p>
            <button type="submit">Registrarme</button>
            <p>¿Ya tienes cuenta? <Link to="/login">Ingresa</Link></p>
        </form>
    );
}