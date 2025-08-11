document.addEventListener('DOMContentLoaded', function() {
  // Typing Animation
  const textArray = [
    "Python Full Stack Developer",
    "Web Developer",
    "Open Source Contributor"
  ];
  
  let index = 0;
  let textIndex = 0;
  let isDeleting = false;
  let isEnd = false;
  
  function type() {
    const currentText = textArray[index];
    const animatedText = document.getElementById("animated-text");
    
    if (isDeleting) {
      animatedText.textContent = currentText.substring(0, textIndex--);
    } else {
      animatedText.textContent = currentText.substring(0, textIndex++);
    }
    
    if (!isDeleting && textIndex === currentText.length) {
      isEnd = true;
      isDeleting = true;
      setTimeout(type, 1500);
    } else if (isDeleting && textIndex === 0) {
      isDeleting = false;
      index = (index + 1) % textArray.length;
      setTimeout(type, 500);
    } else {
      const speed = isDeleting ? 50 : 100;
      setTimeout(type, speed);
    }
  }
  
  // Start typing effect
  setTimeout(type, 1000);
  
  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  hamburger.addEventListener('click', function() {
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  
  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
  
  // Navbar scroll effect
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Animation on scroll
  const animateElements = document.querySelectorAll('.animate__animated');
  
  function checkScroll() {
    animateElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight - 100) {
        element.classList.add('animate__fadeInUp');
      }
    });
  }
  
  window.addEventListener('scroll', checkScroll);
  window.addEventListener('load', checkScroll);
  
  // Set active nav link based on scroll position
  const sections = document.querySelectorAll('section');
  
  function setActiveLink() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', setActiveLink);
});