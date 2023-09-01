import { FC, HTMLProps } from "react";

interface Props extends HTMLProps<HTMLDivElement> {
  visible: boolean;
  close: () => void;
}
const Modal: FC<Props> = (props) => {
  if (!props.visible) return null;
  return (
    <div
      onClick={props.close}
      className="overflow-auto top-0 left-0 fixed z-10 w-full h-screen flex items-center justify-center bg-black bg-opacity-40"
    >
      {props.children}
    </div>
  );
};
export default Modal;
