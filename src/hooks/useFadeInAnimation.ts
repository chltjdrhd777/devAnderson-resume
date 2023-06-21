import { useEffect, useState } from 'react';

function useFadeInAnimation() {
  const [observer, setObserver] = useState(null);

  useEffect(() => {
    const nodes = document.querySelectorAll('.animate');

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fadeIn');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: [0.7] },
    );

    nodes.forEach(node => {
      observer.observe(node);
    });

    setObserver(observer);
  }, []);

  return observer;
}

export default useFadeInAnimation;
