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
                alert('Błędny login lub hasło!');
                return;
            } else if (response.status === 403) {
                alert('Użytkownik został zablokowany!');
                return;
            } else {
                alert('Błąd bazy danych.');
                return;
            }
        }
        const personaldata = response.json();
        return personaldata;
    } catch (error) {
        alert('Logowanie się nie powiodło!');
    }
}

export { handleLogin };
