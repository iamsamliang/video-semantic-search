import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { FC, MouseEvent } from "react";

type ThemeTogglerProps = {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

const ThemeToggler: FC<ThemeTogglerProps> = ({
  onClick = () => {},
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="size-9 p-2 rounded-md hover:bg-neutral-100 hover:dark:bg-neutral-900"
    >
      <MoonIcon className="block dark:hidden" height={20} />
      <SunIcon className="hidden dark:block" height={20} />
    </button>
  );
};

export default ThemeToggler;
