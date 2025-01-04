import RightArrow from "@material-symbols/svg-400/rounded/arrow_right_alt-fill.svg?react";
import LeftArrow from "@material-symbols/svg-400/rounded/arrow_left_alt-fill.svg?react";
import { ReactNode, useState } from "react";
import classNames from "classnames";
import { Slide } from "@mui/material";

interface CarouselPageProps {
  content: ReactNode;
  stepComplete: boolean;
  onComplete?: () => void;
  onCancel?: () => void;
}

const OnboardingCarousel = ({ pages }: { pages: CarouselPageProps[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="flex h-full">
      <div className="h-full w-[60px] items-center flex">
        <button
          className={classNames({ hidden: currentIndex === 0 })}
          onClick={() => {
            pages[currentIndex].onCancel?.();
            setCurrentIndex(currentIndex - 1);
          }}
        >
          <LeftArrow className="fill-secondary-default" />
        </button>
      </div>
      <div className="flex flex-col h-full w-full items-center">
        <div className="w-full h-full overflow-hidden">
          {pages.map((props, index) => (
            <Slide
              in={index === currentIndex}
              direction="right"
              className="w-full h-full"
              mountOnEnter
              appear={false}
              timeout={300}
              unmountOnExit
              key={index}
            >
              <div className="w-full h-full">{props.content}</div>
            </Slide>
          ))}
        </div>
        <div className="w-fit flex gap-2">
          {pages.map(({ stepComplete }, i) => (
            <button
              key={i + "button"}
              onClick={() => {
                if (stepComplete || pages.at(i - 1)?.stepComplete) {
                  setCurrentIndex(i);
                }
              }}
              className={classNames("rounded-full size-2", {
                "bg-secondary-light": currentIndex !== i,
                "bg-secondary-dark": currentIndex === i,
              })}
            />
          ))}
        </div>
      </div>
      <div className="h-full items-center flex w-[60px]">
        <button
          onClick={() => {
            if (pages[currentIndex].stepComplete) {
              pages[currentIndex].onComplete?.();
              setCurrentIndex(currentIndex + 1);
            }
          }}
          className={classNames({ hidden: !pages[currentIndex].stepComplete })}
        >
          <RightArrow className="fill-secondary-default" />
        </button>
      </div>
    </div>
  );
};

export default OnboardingCarousel;
