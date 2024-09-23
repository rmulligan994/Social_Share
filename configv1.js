<script>
// Configuration object
const config = {
  // Company and branding
  companyName: "Guillaume's Winery",
  careersPageUrl: 'https://www.guillaumeswinery.com/careers',
  
  // Fonts and colors
  fonts: {
    main: 'Quicksand',
    title: 'Corben'
  },
  colors: {
    primary: '#BB86FC',
    secondary: '#03DAC6',
    background: '#121212',
    text: '#FFFFFF',
    subtext: '#B0B0B0',
    border: '#333333',
    buttonHover: '#3700B3'
  },
  
  // Sharing options
  shareHashtags: '#TraditionMeetsInnovation #JobAlert #Careers',
  emailSubject: 'Exciting Job Opportunities at Guillaume\'s Winery',
  
  // Modal settings
  modalWidth: '90%',
  modalMaxWidth: '500px',
  modalMaxHeight: '90vh',
  
  // Job listing selectors (customize these based on your HTML structure)
  jobSelectors: {
    container: '.job-result-row',
    title: '.job-result-col1.title .h6-search',
    reqId: '.job-result-col1.title .paragraph-sm-3',
    location: '.job-result-col1.location .h6-search',
    department: '.job-result-col1.dept .h6-search',
    applyLink: 'a.btn.btn-three.w-inline-block'
  },
  
  // Share button selector (customize this based on your HTML structure)
  shareButtonSelector: '[class^="social_share-btn"]',
  
  // Customizable text
  text: {
    modalTitle: {
      single: 'Select a Job to Share',
      multiple: 'Select Jobs to Share'
    },
    modalSubtitle: {
      twitter: 'Choose one job to share. Twitter has a character limit, so we\'ll create a tweet for the selected job.',
      facebook: 'Choose one job to share. We\'ll share the direct link to the selected job posting.',
      linkedin: 'You can select multiple jobs. We\'ll create a post featuring all selected jobs.',
      email: 'You can select multiple jobs. We\'ll generate an email with details of all selected jobs.'
    },
    shareButton: 'Share Selected Job(s)',
    noJobSelectedAlert: 'Please select at least one job to share.',
    emailInstructions: 'It seems your browser doesn\'t support automatic email composition. Please copy the content below and paste it into your email client:',
    copyButtonText: 'Copy to Clipboard',
    copiedText: 'Copied!'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  
  console.log('Social Share ready to go :)');
  // Load fonts
  const fontLink = document.createElement('link');
  fontLink.href = `https://fonts.googleapis.com/css2?family=${config.fonts.title}:wght@400;700&family=${config.fonts.main}:wght@300;400;500;600;700&display=swap`;
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);

  // Add global styles
  const globalStyles = document.createElement('style');
  globalStyles.textContent = `
    .gw-modal {
      position: fixed;
      z-index: 1001;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: '${config.fonts.main}', sans-serif;
    }
    .gw-modal-content {
      background-color: ${config.colors.background};
      padding: 30px;
      border-radius: 8px;
      width: ${config.modalWidth};
      max-width: ${config.modalMaxWidth};
      max-height: ${config.modalMaxHeight};
      color: ${config.colors.text};
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .gw-title {
      margin-top: 0;
      margin-bottom: 10px;
      font-family: '${config.fonts.title}', cursive;
      font-size: 1.5rem;
      font-weight: 700;
      text-align: center;
      text-transform: uppercase;
      color: ${config.colors.primary};
    }
    .gw-subtitle {
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 0.9rem;
      text-align: center;
      color: ${config.colors.subtext};
    }
    .gw-job-list {
      max-height: 50vh;
      overflow-y: auto;
      margin-bottom: 20px;
      padding: 10px;
    }
    .gw-job-item {
      margin-bottom: 10px;
      border: 2px solid ${config.colors.border};
      border-radius: 8px;
      transition: all 0.3s ease;
      overflow: hidden;
    }
    .gw-job-item:hover {
      border-color: ${config.colors.primary};
      box-shadow: 0 2px 8px rgba(216, 108, 106, 0.15);
    }
    .gw-job-item label {
      display: flex;
      align-items: center;
      padding: 15px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    .gw-job-item label:hover {
      background-color: #f5f5f5;
    }
    .gw-job-item input {
      margin-right: 15px;
    }
    .gw-job-details {
      flex-grow: 1;
    }
    .gw-job-title {
      font-weight: 600;
      font-size: 1rem;
      margin-bottom: 5px;
      color: ${config.colors.secondary};
    }
    .gw-job-location {
      font-size: 0.9rem;
      color: ${config.colors.subtext};
    }
    .gw-button {
      display: block;
      width: calc(100% - 40px); /* Subtract left and right padding */
      margin: 20px auto 0; /* Center the button and add top margin */
      padding: 12px;
      background-color: ${config.colors.primary};
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      transition: background-color 0.3s ease;
    }
    .gw-button:hover {
      background-color: ${config.colors.buttonHover};
    }
    .gw-textarea {
      width: 100%;
      height: 150px;
      padding: 10px;
      margin-bottom: 20px;
      border: 1px solid ${config.colors.border};
      border-radius: 4px;
      font-family: '${config.fonts.main}', sans-serif;
      font-size: 0.9rem;
      resize: vertical;
    }
  `;
  document.head.appendChild(globalStyles);

  // Function to set up event listeners
  function setupEventListeners() {
    const shareButtons = document.querySelectorAll(config.shareButtonSelector);
    shareButtons.forEach(button => {
      if (!button.hasAttribute('data-listener-attached')) {
        button.addEventListener('click', (event) => {
          let target = event.target;
          
          while (target && !target.classList.contains('social_share-btn')) {
            target = target.parentElement;
          }
          
          if (target) {
            const classList = Array.from(target.classList);
            const platform = classList.find(className => className !== 'social_share-btn');
            if (platform) {
              handleShareButtonClick(platform);
            } else {
              console.error('Unable to determine sharing platform');
            }
          } else {
            console.error('Share button not found');
          }
        });
        button.setAttribute('data-listener-attached', 'true');
      }
    });
  }

  // Call the setup function
  setupEventListeners();

  // Set up MutationObserver to handle dynamically added buttons
  const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      if (mutation.type === 'childList') {
        setupEventListeners();
      }
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });

  // Functions
  function getFavoriteJobs() {
    return Array.from(document.querySelectorAll(config.jobSelectors.container))
      .map(item => {
        const titleElement = item.querySelector(config.jobSelectors.title);
        const reqIdElement = item.querySelector(config.jobSelectors.reqId);
        const locationElement = item.querySelector(config.jobSelectors.location);
        const deptElement = item.querySelector(config.jobSelectors.department);
        const linkElement = item.querySelector(config.jobSelectors.applyLink);
        
        if (titleElement && reqIdElement && locationElement && deptElement && linkElement) {
          const title = titleElement.textContent.trim();
          const reqId = reqIdElement.textContent.trim().replace('Req ID:', '').trim();
          const location = locationElement.textContent.trim();
          const department = deptElement.textContent.trim() + " Department";
          return {
            name: `${title} (Req ID: ${reqId})`,
            location: location,
            department: department,
            url: linkElement.href
          };
        }
        return null;
      })
      .filter(Boolean);
  }

  function createTweetText(job) {
    let shareText = `Exciting opportunity at ${config.companyName}! Check out this role:\n\n`;
    shareText += `${job.name} in ${job.location} (${job.department})\n${job.url}\n\n`;
    shareText += config.shareHashtags;
    return shareText.length > 280 ? shareText.substring(0, 277) + "..." : shareText;
  }

  function createLinkedInShareText(jobs) {
    let shareText = `Exciting opportunities at ${config.companyName}! Check out these roles:\n\n`;
    jobs.forEach((job, index) => {
      shareText += `${index + 1}. ${job.name} in ${job.location} (${job.department})\n${job.url}\n\n`;
    });
    shareText += config.shareHashtags;
    return shareText;
  }

  function generateEmailContent(jobs) {
    let body = `Here are my favorite job opportunities at ${config.companyName}:\n\n`;
    jobs.forEach((job, index) => {
      body += `${index + 1}. ${job.name}\n`;
      body += `   Location: ${job.location}\n`;
      body += `   Department: ${job.department}\n`;
      body += `   Apply here: ${job.url}\n\n`;
    });
    body += 'Check them out and apply today!\n\n';
    body += config.shareHashtags;
    return body;
  }

  function openShareDialog(platform, shareContent) {
    let shareUrl;
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareContent)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(config.careersPageUrl)}&text=${encodeURIComponent(shareContent)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareContent)}`;
        break;
      case 'email':
        const mailtoConfig = {
          recipient: '',
          subject: config.emailSubject,
          body: shareContent
        };
        
        // Try to open Gmail first
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${mailtoConfig.recipient}&su=${encodeURIComponent(mailtoConfig.subject)}&body=${encodeURIComponent(mailtoConfig.body)}`;
        const gmailWindow = window.open(gmailUrl, '_blank');
        
        // If Gmail doesn't open (e.g., blocked popup), fall back to mailto
        setTimeout(() => {
          if (!gmailWindow || gmailWindow.closed || typeof gmailWindow.closed == 'undefined') {
            const mailtoUrl = `mailto:${mailtoConfig.recipient}?subject=${encodeURIComponent(mailtoConfig.subject)}&body=${encodeURIComponent(mailtoConfig.body)}`;
            const mailtoAttempt = window.open(mailtoUrl, '_self');
            
            // If mailto also fails, show the fallback modal
            setTimeout(() => {
              if (!mailtoAttempt || mailtoAttempt.closed || typeof mailtoAttempt.closed == 'undefined') {
                showEmailFallbackModal(shareContent);
              }
            }, 1000);
          }
        }, 1000);
        return; // Exit the function early for email case
    }
    
    if (platform !== 'email') {
      window.open(shareUrl, '_blank');
    }
  }

  function showJobSelectionModal(platform) {
    const jobs = getFavoriteJobs();
    const modal = document.createElement('div');
    modal.className = 'gw-modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'gw-modal-content';

    const title = document.createElement('h2');
    title.className = 'gw-title';
    title.textContent = platform === 'linkedin' || platform === 'email' 
      ? config.text.modalTitle.multiple
      : config.text.modalTitle.single;

    const subtitle = document.createElement('p');
    subtitle.className = 'gw-subtitle';
    subtitle.textContent = config.text.modalSubtitle[platform];

    const jobList = document.createElement('div');
    jobList.className = 'gw-job-list';

    jobs.forEach((job, index) => {
      const jobItem = document.createElement('div');
      jobItem.className = 'gw-job-item';

      const input = document.createElement('input');
      input.type = platform === 'linkedin' || platform === 'email' ? 'checkbox' : 'radio';
      input.id = `job-${index}`;
      input.name = 'job-selection';
      input.value = index;

      const label = document.createElement('label');
      label.htmlFor = `job-${index}`;

      const jobDetails = document.createElement('div');
      jobDetails.className = 'gw-job-details';

      const jobTitle = document.createElement('div');
      jobTitle.className = 'gw-job-title';
      jobTitle.textContent = job.name;

      const jobLocation = document.createElement('div');
      jobLocation.className = 'gw-job-location';
      jobLocation.textContent = `${job.location} - ${job.department}`;

      jobDetails.appendChild(jobTitle);
      jobDetails.appendChild(jobLocation);

      label.appendChild(input);
      label.appendChild(jobDetails);
      jobItem.appendChild(label);
      jobList.appendChild(jobItem);
    });

    const shareButton = document.createElement('button');
    shareButton.className = 'gw-button';
    shareButton.textContent = config.text.shareButton;

    shareButton.addEventListener('click', () => {
      const selectedJobs = Array.from(jobList.querySelectorAll('input:checked'))
        .map(input => jobs[parseInt(input.value)]);

      if (selectedJobs.length === 0) {
        alert(config.text.noJobSelectedAlert);
        return;
      }

      let shareContent;
      switch (platform) {
        case 'twitter':
          shareContent = createTweetText(selectedJobs[0]);
          break;
        case 'facebook':
          shareContent = selectedJobs[0].url;
          break;
        case 'linkedin':
          shareContent = createLinkedInShareText(selectedJobs);
          break;
        case 'email':
          shareContent = generateEmailContent(selectedJobs);
          break;
      }

      document.body.removeChild(modal);
      openShareDialog(platform, shareContent);
    });

    modalContent.appendChild(title);
    modalContent.appendChild(subtitle);
    modalContent.appendChild(jobList);
    modalContent.appendChild(shareButton);
    modal.appendChild(modalContent);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });

    document.body.appendChild(modal);
  }

  function handleShareButtonClick(platform) {
    showJobSelectionModal(platform);
  }

  function showEmailFallbackModal(emailContent) {
    const modal = document.createElement('div');
    modal.className = 'gw-modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'gw-modal-content';

    const title = document.createElement('h2');
    title.className = 'gw-title';
    title.textContent = 'Email Content';

    const instruction = document.createElement('p');
    instruction.textContent = config.text.emailInstructions;
    instruction.style.textAlign = 'center';
    instruction.style.marginBottom = '20px';

    const contentArea = document.createElement('textarea');
    contentArea.className = 'gw-textarea';
    contentArea.value = emailContent;

    const copyButton = document.createElement('button');
    copyButton.className = 'gw-button';
    copyButton.textContent = config.text.copyButtonText;

    copyButton.addEventListener('click', () => {
      contentArea.select();
      document.execCommand('copy');
      copyButton.textContent = config.text.copiedText;
      setTimeout(() => {
        copyButton.textContent = config.text.copyButtonText;
      }, 2000);
    });

    modalContent.appendChild(title);
    modalContent.appendChild(instruction);
    modalContent.appendChild(contentArea);
    modalContent.appendChild(copyButton);
    modal.appendChild(modalContent);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });

    document.body.appendChild(modal);
  }
});
</script>
