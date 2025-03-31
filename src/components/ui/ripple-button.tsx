
import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RippleButtonProps extends ButtonProps {
  rippleColor?: string;
  rippleDuration?: number;
  children: React.ReactNode;
}

export function RippleButton({
  rippleColor = "rgba(255, 255, 255, 0.5)",
  rippleDuration = 500,
  className,
  children,
  ...props
}: RippleButtonProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  
  const createRipple = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return;
      
      const button = buttonRef.current;
      const buttonRect = button.getBoundingClientRect();
      
      const circle = document.createElement("span");
      const diameter = Math.max(buttonRect.width, buttonRect.height);
      const radius = diameter / 2;
      
      // Calculate position relative to the button
      const x = event.clientX - buttonRect.left - radius;
      const y = event.clientY - buttonRect.top - radius;
      
      // Style the ripple
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;
      circle.style.position = "absolute";
      circle.style.borderRadius = "50%";
      circle.style.transform = "scale(0)";
      circle.style.backgroundColor = rippleColor;
      circle.style.pointerEvents = "none";
      circle.style.opacity = "1";
      
      // Add animation
      circle.style.animation = `ripple ${rippleDuration}ms linear`;
      
      // Add a CSS class for the ripple
      circle.classList.add("ripple-effect");
      
      // Clean up existing ripples
      const existingRipples = button.querySelectorAll(".ripple-effect");
      existingRipples.forEach((ripple) => {
        if (ripple.classList.contains("removing")) return;
        ripple.classList.add("removing");
        setTimeout(() => ripple.remove(), rippleDuration);
      });
      
      // Add the ripple to the button
      button.appendChild(circle);
      
      // Remove the ripple after animation
      setTimeout(() => {
        if (circle.parentNode === button) {
          button.removeChild(circle);
        }
      }, rippleDuration);
    },
    [rippleColor, rippleDuration]
  );
  
  React.useEffect(() => {
    // Add keyframes to the document if not already present
    if (!document.querySelector('style#ripple-keyframes')) {
      const style = document.createElement('style');
      style.id = 'ripple-keyframes';
      style.innerHTML = `
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  
  return (
    <Button
      ref={buttonRef}
      className={cn("relative overflow-hidden", className)}
      onClick={createRipple}
      {...props}
    >
      {children}
    </Button>
  );
}
