স্মৃতির পাতায় | ১৭ অক্টোবর ২০২৬

স্থানীয়ভাবে চালানো
1. প্রকল্পের মূল ফোল্ডারে terminal খুলুন।
2. চালান: python build_gallery_data.py
3. চালান: python serve.py
4. ব্রাউজারে খুলুন: http://localhost:8000

serve.py স্থানীয় HTTP byte-range সমর্থন করে, যাতে ভিডিওর timeline-এ সামনে-পেছনে
যাওয়া যায়। ভিডিও চালাতে এই server ব্যবহার করুন; সাধারণ http.server byte-range
সমর্থন না করায় কিছু browser-এ seek কাজ নাও করতে পারে।

Netlify-তে প্রকাশ
1. build_gallery_data.py চালিয়ে gallery-data.js হালনাগাদ করুন।
2. netlify-deploy ফোল্ডারটি Netlify Drop-এ আপলোড করুন:
   https://app.netlify.com/drop
3. Netlify-তে sign in/create account করে ফোল্ডারটি Deploy zone-এ টেনে ছাড়ুন।
4. deploy শেষ হলে পাওয়া URL অন্যদের সঙ্গে শেয়ার করুন।
- শুধু netlify-deploy ফোল্ডার আপলোড করুন; প্রকল্পের মূল ফোল্ডার নয়।
- এই প্রকাশ-প্যাকেজে ওয়েবসাইট, ৬৫টি ছবি এবং বর্তমানে ব্যবহৃত ২টি ভিডিও আছে।
- নতুন পরিবর্তন প্রকাশের আগে netlify-deploy-এ সংশ্লিষ্ট site file ও media কপি করে
  তারপর folder-টি আবার deploy করুন।
- ছবিতে থাকা সবার, বিশেষ করে শিশুদের, প্রকাশ্য ব্যবহারের উপযুক্ত সম্মতি আছে কি না
  প্রকাশের আগে নিশ্চিত করুন।

ছবির শ্রেণিবিন্যাস
- sritir-patay-photo-manifest.json হলো ছবির অবস্থান, ধাপ ও প্রদর্শনক্রমের মূল উৎস।
- ছবি যোগ/বাদ/শ্রেণিবিন্যাস বদলানোর পর manifest সম্পাদনা করে build_gallery_data.py চালান।
- Builder অনুপস্থিত, ডুপ্লিকেট বা শ্রেণিবিহীন JPEG পেলে স্পষ্ট ত্রুটি দেখিয়ে থামে।
- মূল ছবি assets/images-এ এবং ভিডিও assets/videos-এ রাখুন। এগুলো website source backup-এ অন্তর্ভুক্ত নয়।
- photo_index.py কেবল photo_index.csv-কে বর্তমান ছবির তালিকা দিয়ে পুনরায় তৈরি করে।

ওয়েবসাইটটি সাধারণ HTML, CSS ও JavaScript ব্যবহার করে। কোনো বাহ্যিক database,
paid service, বা runtime font/network dependency নেই।
