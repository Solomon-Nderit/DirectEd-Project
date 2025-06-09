document.addEventListener('DOMContentLoaded', function() {
      
      // --- Hamburger Menu Logic ---
      const hamburgerBtn = document.getElementById('hamburger-btn');
      const navbarMenu = document.getElementById('navbar-menu');
      
      hamburgerBtn.addEventListener('click', () => {
          navbarMenu.classList.toggle('is-open');
      });

      // Close menu when a link is clicked
      const menuLinks = navbarMenu.querySelectorAll('a, button');
      menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarMenu.classList.contains('is-open')) {
                navbarMenu.classList.remove('is-open');
            }
        });
      });
      // --- End Hamburger Menu Logic ---
        
      // Visitor counter using localStorage
      let visitCount = localStorage.getItem('siteVisitCount');
      if (visitCount) {
        visitCount = parseInt(visitCount) + 1;
      } else {
        visitCount = 1;
      }
      localStorage.setItem('siteVisitCount', visitCount);
      document.getElementById('visitor-count').textContent = visitCount;

      // Audience toggle logic
      const toggleButtons = document.querySelectorAll('.toggle-btn');
      const audienceContents = document.querySelectorAll('.audience-content');
      toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
          const audience = button.dataset.audience;
          toggleButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          audienceContents.forEach(content => content.classList.remove('active'));
          document.getElementById(`${audience}-content`).classList.add('active');
        });
      });

      // FAQ accordion - only one can be open at a time
      const faqItems = document.querySelectorAll('.faq-item');
      faqItems.forEach(clickedItem => {
        const question = clickedItem.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const wasActive = clickedItem.classList.contains('active');

            faqItems.forEach(item => {
                item.classList.remove('active');
            });
            
            if (!wasActive) {
                clickedItem.classList.add('active');
            }
        });
      });
      
      // Basic Chatbot placeholder functionality
      const chatSendBtn = document.getElementById('chat-send-btn');
      const chatInputField = document.getElementById('chat-input-field');
      const chatMessages = document.getElementById('chat-messages');

      chatSendBtn.addEventListener('click', () => {
          const messageText = chatInputField.value.trim();
          if (messageText) {
              const userMessage = document.createElement('div');
              userMessage.className = 'message user-message';
              userMessage.textContent = messageText;
              chatMessages.appendChild(userMessage);
              
              chatInputField.value = '';
              chatMessages.scrollTop = chatMessages.scrollHeight;
          }
      });

      // Contact form validation
      const contactForm = document.getElementById('contact-form');
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;
        
        const name = document.getElementById('name');
        const nameError = document.getElementById('name-error');
        if (name.value.trim() === '') {
          nameError.style.display = 'block';
          isValid = false;
        } else {
          nameError.style.display = 'none';
        }
        
        const email = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
          emailError.style.display = 'block';
          isValid = false;
        } else {
          emailError.style.display = 'none';
        }
        
        const message = document.getElementById('message');
        const messageError = document.getElementById('message-error');
        if (message.value.trim() === '') {
          messageError.style.display = 'block';
          isValid = false;
        } else {
          messageError.style.display = 'none';
        }
        
        if (isValid) {
          alert('Thank you for your message! We will get back to you soon.');
          contactForm.reset();
        }
      });

      // Theme toggle
      const themeToggle = document.getElementById('theme-toggle');
      const themeIcon = themeToggle.querySelector('i');
      const body = document.body;

      const applyTheme = (theme) => {
        if (theme === 'dark') {
          body.classList.add('dark-theme');
          themeIcon.classList.remove('fa-moon');
          themeIcon.classList.add('fa-sun');
        } else {
          body.classList.remove('dark-theme');
          themeIcon.classList.remove('fa-sun');
          themeIcon.classList.add('fa-moon');
        }
      };
      
      themeToggle.addEventListener('click', function() {
        const isDark = body.classList.contains('dark-theme');
        if (isDark) {
          localStorage.setItem('theme', 'light');
          applyTheme('light');
        } else {
          localStorage.setItem('theme', 'dark');
          applyTheme('dark');
        }
      });
      
      const savedTheme = localStorage.getItem('theme') || 'light';
      applyTheme(savedTheme);

      // Smooth scrolling for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          if (targetId.length > 1) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
              const offset = 70;
              const elementPosition = targetElement.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - offset;
              
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }
          }
        });
      });
    });
    // --- AI Chatbot functionality with History and Context ---
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatInputField = document.getElementById('chat-input-field');
    const chatMessagesContainer = document.getElementById('chat-messages');

    // 1. Provide website context in a system prompt
    const praxisContext = `
      You are the Praxis Assistant, a helpful AI chatbot for the Praxis Craftsmanship Community website.
      Your goal is to answer user questions based on the following information about Praxis. Be friendly and helpful.

      - **What is Praxis?** Praxis is a community-driven platform for preserving and sharing the art of craftsmanship. It connects master artisans with learners.
      - **Mission:** To reverse the trend of disposable, mass-produced goods by teaching traditional skills.
      - **For Learners:** Praxis offers "Trade-in-a-Box" kits with tools, materials, and video tutorials for crafts like leatherworking.
      - **For Artisans:** Praxis provides a marketplace to sell high-quality, handcrafted goods. Artisans go through a certification process to ensure quality.
      - **Products:**
        1.  **Trade-in-a-Box Kits:** Comprehensive kits for learning crafts.
        2.  **Artisan Marketplace:** A place to buy durable, beautifully crafted goods.
        3.  **Repair & Restoration:** A service to connect users with artisans for quality repairs of items like shoes and clothing.
      - **Founders:** Solomon Nderitu (CEO & Co-Founder) and Benson Mose (Head of Artisan Relations).
      - **FAQs:** Users can get started with a Trade-in-a-Box kit. Artisans are certified through a portfolio and skill review. Repairs are handled by submitting photos for a quote online.
    `;

    // 2. Create an array to store the conversation history
    let conversationHistory = [
      { role: 'system', content: praxisContext }
    ];

    const handleSendMessage = async () => {
      const messageText = chatInputField.value.trim();
      if (messageText) {
        // Add user message to UI
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'message user-message';
        userMessageDiv.textContent = messageText;
        chatMessagesContainer.appendChild(userMessageDiv);
        chatInputField.value = '';
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

        // Add user message to history
        conversationHistory.push({ role: 'user', content: messageText });

        try {
          // 3. Send the entire conversation history to the AI
          const response = await puter.ai.chat(conversationHistory);

          // Add AI response to history
          conversationHistory.push({ role: 'assistant', content: response });

          // Display AI response in the UI
          const botMessageDiv = document.createElement('div');
          botMessageDiv.className = 'message bot-message';
          botMessageDiv.textContent = response;
          chatMessagesContainer.appendChild(botMessageDiv);
          chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

        } catch (error) {
          console.error('Error getting AI response:', error);
          const errorMessageDiv = document.createElement('div');
          errorMessageDiv.className = 'message bot-message';
          errorMessageDiv.textContent = 'Sorry, I seem to be having trouble connecting. Please try again later.';
          chatMessagesContainer.appendChild(errorMessageDiv);
          chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        }
      }
    };

    chatSendBtn.addEventListener('click', handleSendMessage);
    chatInputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    });