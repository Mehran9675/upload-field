import { SyntheticEvent } from "react";

export default function stopPropagation(event: SyntheticEvent) {
  return event.stopPropagation();
}
