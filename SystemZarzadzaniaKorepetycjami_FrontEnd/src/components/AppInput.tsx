interface AppNonTextInputProps {
    inputValue: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface AppTextInputProps {
    placecholder: string;
    inputValue: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface AppCheckboxInputProps {
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function AppTextInput({
    placecholder,
    inputValue,
    onChange,
}: AppTextInputProps) {
    return (
        <input
            type="text"
            placeholder={placecholder}
            value={inputValue}
            onChange={onChange}
        />
    );
}

function AppEmailInput({ inputValue, onChange }: AppNonTextInputProps) {
    return (
        <input
            type="email"
            placeholder="Adres email"
            value={inputValue}
            onChange={onChange}
        />
    );
}

function AppPasswordInput({ inputValue, onChange }: AppNonTextInputProps) {
    return (
        <input
            type="password"
            placeholder="Hasło"
            value={inputValue}
            onChange={onChange}
        />
    );
}

function AppRepeatPasswordInput({
    inputValue,
    onChange,
}: AppNonTextInputProps) {
    return (
        <input
            type="password"
            placeholder="Powtórz hasło"
            value={inputValue}
            onChange={onChange}
        />
    );
}

function AppDateInput({
    placecholder,
    inputValue,
    onChange,
}: AppTextInputProps) {
    return (
        <input
            type="date"
            placeholder={placecholder}
            value={inputValue}
            onChange={onChange}
        />
    );
}

function AppCheckboxInput({ checked, onChange }: AppCheckboxInputProps) {
    return <input type="checkbox" checked={checked} onChange={onChange} />;
}

export {
    AppTextInput,
    AppEmailInput,
    AppPasswordInput,
    AppRepeatPasswordInput,
    AppDateInput,
    AppCheckboxInput,
};
