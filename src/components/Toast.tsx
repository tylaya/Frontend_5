import React from "react";

type Props = { message: string };

const Toast: React.FC<Props> = ({ message }) => {
  return (
    <div className="toast" role="status" aria-live="polite">
      {message}
    </div>
  );
};

export default Toast;