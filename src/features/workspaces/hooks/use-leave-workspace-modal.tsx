import { useQueryState, parseAsBoolean } from "nuqs";

export const useLeaveWorkspaceModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "leave-workspace",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    open,
    close,
    setIsOpen,
  };
};
