import React from "react";

const Footer = () => {
  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
      <p>
        built by{" "}
        <a
          href="https://sanoncode.com"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Sanoncode
        </a>
        🍷
      </p>
    </footer>
  );
};

export default Footer;
