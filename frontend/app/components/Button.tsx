type ButtonProps = {
  onClick: () => void;
  label: string;
};

const Button = ({ onClick, label }: ButtonProps) => (
  <button
    onClick={onClick}
    className="px-6 py-2 rounded-xl bg-[#5093B4] text-white font-medium text-sm shadow hover:bg-[#69B9D8] transition-colors duration-200"
  >
    {label}
  </button>
);

export default Button;
