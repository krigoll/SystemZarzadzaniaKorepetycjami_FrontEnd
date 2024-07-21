interface AppTextInputProps {
  inputValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function AppTextInput({ inputValue, onChange }: AppTextInputProps) {
  return <input type="text" value={inputValue} onChange={onChange} />;
}

function AppEmailInput({ inputValue, onChange }: AppTextInputProps) {
  return (
    <input
      type="email"
      placeholder="Adres email"
      value={inputValue}
      onChange={onChange}
    />
  );
}

function AppPasswordInput({ inputValue, onChange }: AppTextInputProps) {
  return (
    <input
      type="password"
      placeholder="Hasło"
      value={inputValue}
      onChange={onChange}
    />
  );
}

export { AppTextInput, AppEmailInput, AppPasswordInput };
