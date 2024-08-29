import { loginToApp } from './API';

interface LoginProps {
    email: string;
    password: string;
}

async function handleLogin({ email, password }: LoginProps) {
    try {
        const response = await loginToApp({ email, password });
        if (!response.ok) {
            if (response.status === 401) {
                alert('Błędny login lub hasło');
                return;
            } else {
                alert('Bazy danych'); // TODO: dodać przejscie do stony, kod 500
                return;
            }
        }
        const personaldata = response.json();
        return personaldata;
    } catch (error) {
        console.error('Login failed', error);
        alert('Login failed');
    }
}

export { handleLogin };
