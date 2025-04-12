
export const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-between gap-4 p-4 text-sm text-muted-foreground md:flex-row">
      <div className="flex items-center gap-2">
        <a
          href="https://github.com/ldamasio"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
        <a
          href="https://www.linkedin.com/in/ldamasio/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Linkedin
        </a>
      </div>
      <p className="text-center">
        &copy; {new Date().getFullYear()} Leandro Damasio. All rights reserved.
      </p>
    </footer>
  );
};
