import { useNavigation } from "react-router";
import { useEffect, useState } from "react";

const NavigationProgressBar = () => {
  const navigation = useNavigation();
  const isNavigating = navigation.state === "loading";
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isNavigating) {
      setProgress(10);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);
    } else {
      setProgress(100);
      const timeout = setTimeout(() => setProgress(0), 300);
      return () => clearTimeout(timeout);
    }

    return () => clearInterval(interval);
  }, [isNavigating]);

  if (progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-[#2E7D32] z-[10000] transition-all duration-300 ease-out"
      style={{
        width: `${progress}%`,
        boxShadow: "0 0 10px rgba(46, 125, 50, 0.5)",
      }}
    />
  );
};

export default NavigationProgressBar;
