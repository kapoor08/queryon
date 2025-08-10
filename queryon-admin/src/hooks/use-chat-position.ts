type ChatPosition = "bottom-left" | "bottom-right" | "top-left" | "top-right";
type PopoverSide = "top" | "bottom" | "left" | "right";
type PopoverAlign = "start" | "center" | "end";

export function useChatPosition(
  position: ChatPosition,
  isPreview: boolean
): {
  positionClasses: string;
  popoverSide: PopoverSide;
  popoverAlign: PopoverAlign;
} {
  if (isPreview) {
    return {
      positionClasses: "relative",
      popoverSide: "top",
      popoverAlign: "end",
    };
  }

  const positionClasses =
    position === "bottom-left"
      ? "fixed bottom-6 left-6"
      : position === "top-right"
      ? "fixed top-6 right-6"
      : position === "top-left"
      ? "fixed top-6 left-6"
      : "fixed bottom-6 right-6";

  const popoverSide: PopoverSide =
    position === "bottom-left" || position === "bottom-right"
      ? "top"
      : "bottom";

  const popoverAlign: PopoverAlign =
    position === "bottom-left" || position === "top-left" ? "start" : "end";

  return { positionClasses, popoverSide, popoverAlign };
}
