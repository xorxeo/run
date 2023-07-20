import './dialog.module.css';

type Button = {
  buttonText: string;
  buttonOnClick: () => void;
};

type DialogProps = {
  buttons: Button[];
  content: {
    title: string;
    body: string;
  };
};

export const Dialog = ({ buttons, content }: DialogProps) => {
  return (
    <div className="dialog-container">
      <div className="dialog-content">{content.body}</div>
      <div className="dialog-buttons">
        {buttons.map((button, index) => (
          <div key={index} className=" dialog-button">
            <button
              key={index}
              onClick={button.buttonOnClick}
              className="btn hover:bg-yellow-400"
            >
              {button.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
