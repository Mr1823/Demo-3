import React from "react";
import { motion } from "framer-motion";

const AnimateText = ({ children, initialDelay = 0, wordDelay = 0.1, separator = " " }) => {
  // Extract string text if children is a React element or array
  let text = children;
  if (typeof children !== "string") {
    if (React.isValidElement(children) && typeof children.props.children === "string") {
      text = children.props.children;
    } else if (Array.isArray(children)) {
      text = children.join("");
    } else if (children !== null && children !== undefined) {
      text = String(children);
    } else {
      return null;
    }
  }

  const items = text.split(separator);

  return (
    <span className="inline-block">
      {items.map((item, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.4,
            delay: initialDelay + index * wordDelay,
            ease: "easeOut",
          }}
          className="inline-block"
        >
          {item}
          {index < items.length - 1 && separator === " " ? "\u00A0" : separator}
        </motion.span>
      ))}
    </span>
  );
};

export default AnimateText;
