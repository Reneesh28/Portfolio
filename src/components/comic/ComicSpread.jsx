import React, { forwardRef } from 'react';

const ComicSpread = forwardRef(({ children, id, className = '', ...props }, ref) => {
  return (
    <section
      ref={ref}
      id={id}
      className={`relative w-full min-h-screen flex flex-col py-24 px-4 md:px-12 lg:px-24 overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </section>
  );
});

ComicSpread.displayName = 'ComicSpread';

export default ComicSpread;
