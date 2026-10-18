// (() => {
//   const photos = Array.isArray(window.EVENT_PHOTOS) ? window.EVENT_PHOTOS : [];
//   const photoByNo = n => photos.find(p => p.number === n);
//   const photoUrl = p => 'assets/images/' + encodeURIComponent(p.filename);
//   const used = new Set();

//   // All photos are rendered in the full gallery, so none are silently omitted.
//   // Category lists are provisional and based on the contact-sheet order.
//   const groups = {
//     prep: [1,2,3,4,5,6,7,8,9,10,11,12,13,16,17,18,33,34,35,36,37,39,41,42,43,44,45,46,47,48,49,50,51,52,53,59,60,61,62,63,64,65,66,67,68,69,70,72,74,75,77],
//     wassil: [14,19,22,23,24,25,26,27,28,29,30,31,32,38,54,55,56,57,58,71,73,76,78,79,82,83,84],
//     astha: [],
//   };

//   function card(photo, caption) {
//     const figure = document.createElement('figure');
//     figure.className = 'photo-card';
//     figure.dataset.number = photo.number;
//     figure.dataset.category = groups.prep.includes(photo.number) ? 'prep' : 'serving';
//     const button = document.createElement('button');
//     button.type = 'button';
//     button.setAttribute('aria-label', 'ছবি বড় করে দেখুন: ' + photo.filename);
//     const img = document.createElement('img');
//     img.src = photoUrl(photo);
//     img.alt = caption;
//     img.loading = 'lazy';
//     img.decoding = 'async';
//     img.onerror = () => { figure.classList.add('missing-image'); console.warn('Image file not found:', photo.filename); };
//     button.appendChild(img);
//     button.addEventListener('click', () => openLightbox(photo));
//     const cap = document.createElement('figcaption');
//     cap.textContent = caption;
//     figure.append(button, cap);
//     return figure;
//   }

//   function renderGrid(id, numbers, caption, showNotice = false) {
//     const root = document.getElementById(id);
//     if (!root) return;
//     const valid = numbers.map(photoByNo).filter(Boolean);
//     if (!valid.length) {
//       root.innerHTML = '';
//       if (showNotice) document.getElementById('astha-notice').textContent =
//         'আস্থা নিবাস বৃদ্ধাশ্রমের বয়স্ক নারীদের খাবার গ্রহণের ছবিগুলো বর্তমান ৮৫টি ছবির contact sheet-এ শনাক্ত করা যায়নি। সঠিক ছবিগুলো assets/images-এ যোগ করে নিচের gallery-data.js পুনরায় তৈরি করলে এই অংশে যুক্ত করা যাবে।';
//       return;
//     }
//     valid.forEach(p => root.appendChild(card(p, caption)));
//   }

//   renderGrid('prep-grid', groups.prep, 'রান্না ও প্রস্তুতির মুহূর্ত');
//   renderGrid('wassil-grid', groups.wassil, 'ওয়াসিল উদ্দিন আহমদনগর মাদ্রাসার আয়োজন');
//   renderGrid('astha-grid', groups.astha, 'আস্থা নিবাস বৃদ্ধাশ্রমের খাবারের মুহূর্ত', true);

//   const allGrid = document.getElementById('all-grid');
//   photos.forEach(p => allGrid.appendChild(card(p, '১৭ অক্টোবর ২০২৬ · ছবি ' + String(p.number).padStart(3,'0'))));

//   // Use less repetitive, more representative cover photos.
//   const hero1 = photoByNo(16) || photoByNo(35) || photos[0];
//   const hero2 = photoByNo(29) || photoByNo(22) || photos[1];
//   if (hero1) document.getElementById('hero-photo').src = photoUrl(hero1);
//   if (hero2) document.getElementById('hero-photo-small').src = photoUrl(hero2);

//   // Grid filters apply only to the complete photo collection.
//   document.querySelectorAll('.filter').forEach(btn => {
//     btn.addEventListener('click', () => {
//       document.querySelectorAll('.filter').forEach(b => b.classList.toggle('active', b === btn));
//       const filter = btn.dataset.filter;
//       document.querySelectorAll('#all-grid .photo-card').forEach(el => {
//         el.style.display = filter === 'all' || el.dataset.category === filter ? '' : 'none';
//       });
//     });
//   });

//   const dialog = document.getElementById('lightbox');
//   const lightboxImg = document.getElementById('lightbox-img');
//   const lightboxCaption = document.getElementById('lightbox-caption');
//   let current = 0;
//   function openLightbox(photo) {
//     current = photos.findIndex(p => p.number === photo.number);
//     showLightboxPhoto();
//     dialog.showModal();
//   }
//   function showLightboxPhoto() {
//     const p = photos[current];
//     if (!p) return;
//     lightboxImg.src = photoUrl(p);
//     lightboxImg.alt = p.filename;
//     lightboxCaption.textContent = p.filename;
//   }
//   document.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
//   document.querySelector('.lightbox-prev').addEventListener('click', () => { current = (current - 1 + photos.length) % photos.length; showLightboxPhoto(); });
//   document.querySelector('.lightbox-next').addEventListener('click', () => { current = (current + 1) % photos.length; showLightboxPhoto(); });
//   dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

//   // Native HTML video controls support seeking. Report errors visibly.
//   const video = document.getElementById('event-video');
//   const help = document.getElementById('video-help');
//   video.addEventListener('loadedmetadata', () => {
//     help.textContent = 'ভিডিও প্রস্তুত। নিচের timeline-এ ক্লিক বা drag করে যেকোনো সময়ে যেতে পারবেন।';
//   });
//   video.addEventListener('error', () => {
//     help.textContent = 'ভিডিও লোড হয়নি। ফাইলের নাম ও assets/videos/ পথ পরীক্ষা করুন। seeking সমস্যা থাকলে ভিডিওটি H.264 MP4 হিসেবে fast-start metadata দিয়ে export করুন।';
//   });
// })();
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    renderCategorizedGallery();
});

// Category Groupings & Bangla Names
const categoryGroups = [
    {
        id: 'prep',
        title: '১. বাজার ও প্রস্তুতি (Shopping & Preparation)',
        icon: 'shopping-bag',
        stages: ['shopping', 'prep']
    },
    {
        id: 'packing',
        title: '২. প্যাকিং ও পরিবহন (Packing & Transport)',
        icon: 'truck',
        stages: ['packing', 'transport']
    },
    {
        id: 'distribution',
        title: '৩. খাবার পরিবেশন ও গ্রহণ (Food Serving & Eating)',
        icon: 'utensils',
        stages: ['distribution', 'serving', 'eating']
    },
    {
        id: 'dua',
        title: '৪. দোয়া অনুষ্ঠান (Doa Onusthan)',
        icon: 'heart-handshake',
        stages: ['dua']
    },
    {
        id: 'group',
        title: '৫. গ্রুপ ছবি (Group Photos)',
        icon: 'users',
        stages: ['group']
    }
];

const locationLabels = {
    astha: 'আস্থা নিবাস',
    wasil: 'ওয়াসিল উদ্দিন',
    general: 'সাধারণ'
};

function renderCategorizedGallery() {
    const gridContainer = document.getElementById('galleryGrid');
    if (!gridContainer || typeof galleryData === 'undefined') return;

    // Clear previous elements
    gridContainer.innerHTML = '';

    categoryGroups.forEach(group => {
        // Filter items belonging to this category
        const items = galleryData.filter(item => group.stages.includes(item.stage));
        const isVideoGroup = group.id === 'dua';

        if (items.length === 0 && !isVideoGroup) return;

        // Create Section Block
        const sectionBlock = document.createElement('div');
        sectionBlock.className = 'category-section';
        sectionBlock.setAttribute('data-category', group.id);
        sectionBlock.style.cssText = 'grid-column: 1 / -1; margin-top: 35px; margin-bottom: 15px;';

        sectionBlock.innerHTML = `
            <h3 style="font-size: 1.3rem; color: var(--primary); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; border-bottom: 2px solid var(--border-color); padding-bottom: 6px;">
                <i data-lucide="${group.icon}"></i> ${group.title}
                <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: normal;">(${isVideoGroup ? items.length + 1 : items.length}টি ফাইল)</span>
            </h3>
            <div class="category-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 15px;"></div>
        `;

        const subGrid = sectionBlock.querySelector('.category-grid');

        // If this is the Doa section, prepend the main featured video
        if (isVideoGroup) {
            const videoCard = document.createElement('div');
            videoCard.className = 'media-card';
            videoCard.setAttribute('data-stage', 'dua');
            videoCard.onclick = () => openLightboxVideo('assets/ma ayesha siddika madrasha.mp4');
            videoCard.innerHTML = `
                <video src="assets/ma ayesha siddika madrasha.mp4" muted style="width: 100%; height: 180px; object-fit: cover;"></video>
                <div class="media-info" style="padding: 10px 12px; display: flex; justify-content: space-between; align-items: center;">
                    <span>মা আয়েশা সিদ্দিকা মাদ্রাসা (দোয়া ও খাবার)</span>
                    <span class="badge" style="background: #e0f2fe; color: #0369a1;">ভিডিও</span>
                </div>
            `;
            subGrid.appendChild(videoCard);
        }

        // Append photo cards
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'media-card';
            card.setAttribute('data-stage', item.stage);

            const imgPath = `assets/${item.filename}`;
            const locText = locationLabels[item.location] || 'সাধারণ';

            card.innerHTML = `
                <img src="${imgPath}" alt="Photo ${item.display_order}" loading="lazy" style="width: 100%; height: 180px; object-fit: cover;" onerror="this.onerror=null; this.src='contact_sheets/contact_sheet_01.jpg';">
                <div class="media-info" style="padding: 10px 12px; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: var(--text-muted);">
                    <span>${locText}</span>
                    <span class="badge" style="background: #feefc3; color: #b45309; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">#${item.display_order}</span>
                </div>
            `;
            card.onclick = () => openLightboxImg(imgPath);
            subGrid.appendChild(card);
        });

        gridContainer.appendChild(sectionBlock);
    });

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Interactive Filter Handler for Filter Buttons
function filterGallery(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }

    const sections = document.querySelectorAll('.category-section');
    sections.forEach(sec => {
        const catId = sec.getAttribute('data-category');
        if (category === 'all' || catId === category || 
           (category === 'distribution' && catId === 'distribution') ||
           (category === 'eating' && catId === 'distribution')) {
            sec.style.display = 'block';
        } else {
            sec.style.display = 'none';
        }
    });
}

// Lightbox Modal Functions
function openLightboxImg(src) {
    const container = document.getElementById('lightboxMediaContainer');
    container.innerHTML = `<img src="${src}" class="lightbox-content" style="max-width: 90%; max-height: 85vh; border-radius: 12px;">`;
    document.getElementById('lightbox').classList.add('active');
}

function openLightboxVideo(src) {
    const container = document.getElementById('lightboxMediaContainer');
    container.innerHTML = `<video src="${src}" controls autoplay class="lightbox-content" style="max-width: 90%; max-height: 85vh; border-radius: 12px;"></video>`;
    document.getElementById('lightbox').classList.add('active');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.getElementById('lightboxMediaContainer').innerHTML = '';
}