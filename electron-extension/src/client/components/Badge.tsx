import { cn } from "../utils/cn";

type Props = {
  variant?: "success" | "error" | "warning";
};
export const Badge: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  variant,
}) => {
  let classes = `inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20`;
  switch (variant) {
    case "success":
      classes = cn(classes, "bg-green-50 text-green-700");
      break;
    case "error":
      classes = cn(classes, "bg-red-50 text-red-700");
      break;
    case "warning":
      classes = cn(classes, "bg-yellow-50 text-yellow-700");
      break;
    default:
      classes = cn(classes, "bg-green-50 text-green-700");
      break;
  }

  return <span className={classes}>{children}</span>;
};
