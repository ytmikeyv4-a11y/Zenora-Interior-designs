/**
 * ZENORA DESIGNS - Marketing Site Interactivity & WhatsApp Leads
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Walkthrough Engine
  if (document.getElementById('walkthrough-canvas')) {
    new ZenoraWalkthrough('walkthrough-canvas', 'walkthrough-section');
  }

  // 2. Preloader Dissolve
  const preloader = document.getElementById('zenora-preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => preloader.remove(), 600);
    }, 800);
  }

  // 3. Navigation Bar Glassmorphism on Scroll
  const navbar = document.getElementById('zenora-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('bg-[#0D0C0B]/90', 'backdrop-blur-md', 'border-b', 'border-[#C5A880]/15', 'shadow-2xl');
      navbar.classList.remove('bg-transparent');
    } else {
      navbar.classList.remove('bg-[#0D0C0B]/90', 'backdrop-blur-md', 'border-b', 'border-[#C5A880]/15', 'shadow-2xl');
      navbar.classList.add('bg-transparent');
    }
  }, { passive: true });

  // 4. Quick Lead Generation (Direct WhatsApp)
  const contactForm = document.getElementById('marketing-lead-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('[name="client_name"]')?.value || 'Client';
      const phone = contactForm.querySelector('[name="client_phone"]')?.value || '';
      const city = contactForm.querySelector('[name="client_city"]')?.value || 'Ahmedabad / Rajkot';
      const spaceType = contactForm.querySelector('[name="space_type"]')?.value || 'Interior Design';
      const area = contactForm.querySelector('[name="space_area"]')?.value || 'Not specified';

      // Zenora WhatsApp Phone Number (defaults to direct link generator)
      const zenoraPhone = contactForm.getAttribute('data-phone') || '919876543210';

      const messageText = 
`*NEW INQUIRY - ZENORA DESIGNS*
🏛 *Client Name:* ${name}
📞 *Phone / WhatsApp:* ${phone}
📍 *Location:* ${city}
🏢 *Project Type:* ${spaceType}
📐 *Approx Area:* ${area}

_Sent via Zenora Official Interactive Scroll Showcase_`;

      const encodedMsg = encodeURIComponent(messageText);
      const waUrl = `https://wa.me/${zenoraPhone}?text=${encodedMsg}`;

      showToast(`Thank you ${name}! Connecting directly with Principal Designer on WhatsApp...`);

      setTimeout(() => {
        window.open(waUrl, '_blank');
        contactForm.reset();
      }, 900);
    });
  }

  // Toast Notification Helper
  function showToast(text) {
    let toast = document.getElementById('zenora-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'zenora-toast';
      toast.className = 'fixed bottom-6 right-6 z-[9999] bg-[#1E1B18] border border-[#C5A880] text-[#F5EFEB] px-5 py-3.5 rounded-lg shadow-2xl flex items-center gap-3 transition-all duration-300 transform translate-y-10 opacity-0 text-sm font-sans';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <div class="w-2.5 h-2.5 rounded-full bg-[#E5C287] animate-ping"></div>
      <div>
        <p class="font-semibold text-[#E5C287] text-xs tracking-wider uppercase">Zenora Concierge</p>
        <p class="text-xs text-[#E5E0D8]">${text}</p>
      </div>
    `;
    toast.classList.remove('translate-y-10', 'opacity-0');
    setTimeout(() => {
      toast.classList.add('translate-y-10', 'opacity-0');
    }, 4500);
  }
});
