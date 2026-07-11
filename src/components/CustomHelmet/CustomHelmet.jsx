import React, { useEffect } from "react";

const CustomHelmet = ({ title }) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | Jewellery Store`;
    } else {
      document.title = "Jewellery Store | Exquisite & Modern Designs";
    }
  }, [title]);

  return null;
};

export default CustomHelmet;
