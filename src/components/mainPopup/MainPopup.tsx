import './mainPopup.module.css';
import { OverlayingPopup } from '../overlayingPopup/OverlayingPopup';

type MainPopupProps = {
  isOpened: boolean;
  // onPrevArrowClick: () => void;
  title?: string;
  onClose: () => void;
  customStyle?: string;
  children: React.ReactNode;
};

export const MainPopup = ({
  children,
  isOpened,
  // onPrevArrowClick,
  onClose,
  title,
  customStyle,
}: MainPopupProps) => {
  return (
    <OverlayingPopup isOpened={isOpened} onClose={onClose}>
      <div className={`main-popup-container ${customStyle}`}>
        <div
          className="min-h-[2rem]"
          // onPrevArrowClick={onPrevArrowClick}
          // title={title}
          // onClose={onClose}
        >
          {title}
        </div>

        {children}
      </div>
    </OverlayingPopup>
  );
};
