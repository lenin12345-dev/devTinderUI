import React from "react";

const Footer = ({ company = "No Company Ltd" }) => {
  return (
    <footer className="footer footer-center bg-base-300 text-base-content p-6 border-t border-base-200">
      <aside>
        <p className="text-sm hover:text-primary transition-colors">
          © {new Date().getFullYear()} {company}. All rights reserved.
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
