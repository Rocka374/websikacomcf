/*
 * Websika - WordPress услуги
 * Основен JavaScript файл
 * Автор: Websika Team
 * Версия: 1.1
 * 
 * Съдържание:
 * 1. Mobile навигация
 * 2. Sticky header
 * 3. Scroll reveal анимации
 * 4. 3D tilt cards
 * 5. Floating blobs
 * 6. Active nav линкове
 * 7. Smooth scrolling
 * 8. prefers-reduced-motion проверка
 */

// Опаковане на кода в IIFE за избегване на замърсяване на глобалния scope
(function() {
  'use strict';
  
  // ===========================================
  // Константи и глобални променливи
  // ===========================================
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // ===========================================
  // 1. Mobile навигация
  // ===========================================
  function initMobileNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navContainer = document.querySelector('.nav-container');
    
    if (!mobileMenuBtn || !navContainer) return;
    
    mobileMenuBtn.addEventListener('click', function() {
      navContainer.classList.toggle('active');
      this.setAttribute('aria-expanded', navContainer.classList.contains('active'));
    });
    
    // Затваряне на менюто при клик извън него
    document.addEventListener('click', function(event) {
      if (!navContainer.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
        navContainer.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Затваряне на менюто при клик на линк
    const navLinks = navContainer.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navContainer.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
  
  // ===========================================
  // 2. Sticky header
  // ===========================================
  function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScroll = 0;
    
    function updateHeader() {
      const currentScroll = window.pageYOffset;
      
      // Добавяне на клас при скрол над 100px
      if (currentScroll > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      // Сваляне на header при скрол надолу (опционално)
      if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      
      lastScroll = currentScroll;
    }
    
    // Throttle функция за оптимизация
    function throttle(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }
    
    window.addEventListener('scroll', throttle(updateHeader, 100));
    updateHeader(); // Инициализиране при зареждане
  }
  
  // ===========================================
  // 3. Scroll reveal анимации
  // ===========================================
  function initScrollReveal() {
    if (REDUCED_MOTION) return;
    
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  }
  
  // ===========================================
  // 4. 3D tilt cards
  // ===========================================
  function initTiltCards() {
    if (REDUCED_MOTION) return;
    
    const tiltCards = document.querySelectorAll('.tilt-card');
    if (tiltCards.length === 0) return;
    
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
      card.addEventListener('mouseenter', handleMouseEnter);
    });
    
    function handleMouseMove(e) {
      const card = e.currentTarget;
      const cardWidth = card.offsetWidth;
      const cardHeight = card.offsetHeight;
      const centerX = card.offsetLeft + cardWidth / 2;
      const centerY = card.offsetTop + cardHeight / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const rotateX = (mouseY / cardHeight) * 10; // Максимум 10 градуса
      const rotateY = (mouseX / cardWidth) * -10; // Максимум 10 градуса
      
      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(1.02, 1.02, 1.02)
      `;
      
      // Леко движение на сенка
      const shadowX = (mouseX / cardWidth) * 20;
      const shadowY = (mouseY / cardHeight) * 20;
      card.style.boxShadow = `
        ${shadowX}px ${shadowY}px 40px rgba(0, 0, 0, 0.1),
        0 8px 32px rgba(0, 0, 0, 0.08)
      `;
    }
    
    function handleMouseLeave(e) {
      const card = e.currentTarget;
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      card.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08)';
    }
    
    function handleMouseEnter(e) {
      const card = e.currentTarget;
      card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    }
  }
  
  // ===========================================
  // 5. Floating blobs
  // ===========================================
  function initFloatingBlobs() {
    if (REDUCED_MOTION) return;
    
    const blobs = document.querySelectorAll('.blob');
    if (blobs.length === 0) return;
    
    // Добавяне на случайни забавления за по-естествено движение
    blobs.forEach((blob, index) => {
      const delay = index * 2;
      blob.style.animationDelay = `-${delay}s`;
    });
  }
  
  // ===========================================
  // 6. Active nav линкове
  // ===========================================
  function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    function updateActiveNavLink() {
      let current = '';
      const scrollPos = window.scrollY + 100;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          current = sectionId;
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href.includes(current)) {
          link.classList.add('active');
        }
      });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Инициализиране при зареждане
  }
  
  // ===========================================
  // 7. Smooth scrolling за вътрешни линкове
  // ===========================================
  function initSmoothScrolling() {
    if (REDUCED_MOTION) return;
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Пропускане за празни линкове
        if (href === '#') return;
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  // ===========================================
  // 8. Инициализация
  // ===========================================
  function init() {
    console.log('Websika - Инициализиране на JavaScript функционалности');
    
    initMobileNavigation();
    initStickyHeader();
    initScrollReveal();
    initTiltCards();
    initFloatingBlobs();
    initActiveNavLinks();
    initSmoothScrolling();
    
    // Добавяне на клас за поддръжка на JavaScript
    document.documentElement.classList.add('js-enabled');
  }
  
  // Зареждане при DOM готов
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();