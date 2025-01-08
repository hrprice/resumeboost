import { ReactNode, useEffect, useState, useRef, RefObject } from "react";

// TODO figure out type inference

const ParentSize = <T extends HTMLElement>({
  children,
}: {
  children: ({
    ref,
    width,
    height,
  }: {
    ref: RefObject<T>;
    width?: number;
    height?: number;
  }) => ReactNode;
}) => {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current && ref.current.parentElement) {
      const parent = ref.current.parentElement;
      setWidth(parent.getBoundingClientRect().width);
      setHeight(parent.getBoundingClientRect().height);

      const handleResize = () => {
        setWidth(parent.getBoundingClientRect().width);
        setHeight(parent.getBoundingClientRect().height);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return <>{children({ ref, width, height })}</>;
};

export default ParentSize;
