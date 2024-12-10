interface AppButtonProps {
  label: string;
  onClick?: () => void;
}

export default function AppButton({ label, onClick }: AppButtonProps) {
  return (
    <button className="AppButton" onClick={onClick}>
      {label}
    </button>
  );
}
