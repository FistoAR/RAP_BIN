gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);


const holder = document.querySelector('.holder');
const sections = document.querySelectorAll('.section');
const gridImgBG = document.getElementById('secBgImage');
const navDropdown = document.getElementById('navDropdown');
const totalSections = sections.length;

// Hide all initially
gsap.set(sections, { autoAlpha: 0 });
gsap.set(gridImgBG, { autoAlpha: 0 });
gsap.set(sections[0], { autoAlpha: 1 });
sections[0].classList.add('active');

// Build timeline with scrub & snap
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".holder-container",
    start: "top top",
    end: `+=${totalSections * window.innerHeight}`, // space for each step and pause
    pin: true,
    scrub: true,  // 🟢 Makes animation depend on scroll
 
    snap: {
      snapTo: 1 / (totalSections * 2 - 1), // snap to each step (rotate + pause)
      duration: 0.4,
      ease: "power1.inOut"
    },
    anticipatePin: 1,
    pinSpacing: false,
    
  }
});

for (let i = 0; i < totalSections; i++) {
  const targetRotation = i * 180;

  // Step 1: Rotate & show section
  tl.to(holder, {
    rotation: targetRotation,
    duration: 1,
    onUpdate: () => {activateSection(i)},
    
  });

  // Step 2: Pause block (just for scroll space)
  tl.to({}, { duration: 0.5 });
}

// Show only current section
function activateSection(index) {
  sections.forEach((sec, idx) => {
    const isActive = idx === index;

    if (isActive) {
      sec.classList.add('active');
      gsap.to(sec, { autoAlpha: 1, duration: 0.3 });

      // Animate inner elements of the active section
      animateChildElements();

      // Background image fade
      if (idx % 2 !== 0) {
        gsap.to(gridImgBG, { autoAlpha: 0.6, duration: 0 });
      } else {
        gsap.to(gridImgBG, { autoAlpha: 0, duration: 0 });
      }
    } else {
      sec.classList.remove('active');
      gsap.to(sec, { autoAlpha: 0, duration: 0.3 });
    }
  });

  // Update numberChanger
  const numberChanger = document.getElementById('numberChanger');
  if (numberChanger) {
    numberChanger.className = numberChanger.className
      .split(' ')
      .filter(cls => !cls.startsWith('numb-'))
      .join(' ')
      .trim();
    numberChanger.classList.add(`numb-${index + 1}`);
  }

  // Sync dropdown
  const targetIndex = index + 1;
  for (let i = 0; i < navDropdown.options.length; i++) {
    const option = navDropdown.options[i];
    if (parseInt(option.dataset.index) === targetIndex) {
      navDropdown.selectedIndex = i;
      break;
    }
  }
}



navDropdown.addEventListener('change', function () {
  const selectedOption = navDropdown.options[navDropdown.selectedIndex];
  const dataIndex = parseInt(selectedOption.dataset.index); // 1-based
  const sectionIndex = dataIndex - 1; // 0-based index of section

  const trigger = ScrollTrigger.getAll()[0];
  const timelineProgress = (sectionIndex * 2) / (totalSections * 2 - 1);
  const targetScrollY = trigger.start + timelineProgress * (trigger.end - trigger.start);

  // Calculate the exact rotation the holder should be at
  const exactRotation = sectionIndex * 180;

  gsap.to(window, {
    scrollTo: targetScrollY,
    duration: 1,
    ease: "power2.inOut",
    onComplete: () => {
    // Smoothly animate to the exact rotation
    gsap.to(holder, {
      rotation: exactRotation,
      duration: 0.4,
      ease: "power2.out"
    });
  }
});
});

function animateChildElements() {
  console.log("Code to animate child elements");
}