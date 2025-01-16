interface AppButtonProps {
    label: string;
    onClick?: () => void;
    disabled?: boolean;
}

export default function AppButton({ label, onClick, disabled }: AppButtonProps) {
    return (
        <button className="AppButton" onClick={onClick} disabled={disabled}>
            {label}
        </button>
    );
}
