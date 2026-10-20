/* =====================================================
   E-PORTFOLIO PRAKTIK MENGAJAR MANDIRI — SCRIPT
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- INIT AOS ---------- */
  if (window.AOS) {
    AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic' });
  }

  /* ---------- LOADER ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      loader.classList.add('hide');
    }, 500);
  });
  // safety fallback in case load event is delayed
  setTimeout(function () { loader.classList.add('hide'); }, 2500);

  /* ---------- ELEMENTS ---------- */
  const sidebar = document.getElementById('sidebar');
  const mainWrapper = document.getElementById('mainWrapper');
  const collapseBtn = document.getElementById('collapseBtn');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const themeToggle = document.getElementById('themeToggle');
  const scrollProgress = document.getElementById('scrollProgress');
  const fabTop = document.getElementById('fabTop');
  const fabHelp = document.getElementById('fabHelp');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  let isDesktop = window.innerWidth > 768;

  /* ---------- SIDEBAR COLLAPSE (desktop, if toggle exists) ---------- */
  if (collapseBtn) {
    collapseBtn.addEventListener('click', function () {
      if (window.innerWidth > 768) {
        sidebar.classList.toggle('collapsed');
        mainWrapper.classList.toggle('collapsed');
      } else {
        sidebar.classList.toggle('mobile-open');
      }
    });
  }

  /* ---------- MOBILE NAV ---------- */
  function openMobileNav() {
    sidebar.classList.add('mobile-open');
    mobileOverlay.classList.add('show');
  }
  function closeMobileNav() {
    sidebar.classList.remove('mobile-open');
    mobileOverlay.classList.remove('show');
  }
  mobileOverlay.addEventListener('click', closeMobileNav);

  window.addEventListener('resize', function () {
    isDesktop = window.innerWidth > 768;
    if (isDesktop) closeMobileNav();
  });

  /* ---------- HAMBURGER TOGGLE ---------- */
  const topbarToggle = document.getElementById('topbarToggle');
  const topbarNav = document.querySelector('.topbar-nav');
  if (topbarToggle && topbarNav) {
    topbarToggle.addEventListener('click', function () {
      const open = topbarNav.classList.toggle('open');
      topbarToggle.classList.toggle('open', open);
      topbarToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    topbarNav.querySelectorAll('.nav-link').forEach(function (l) {
      l.addEventListener('click', function () {
        if (l.classList.contains('dropdown-toggle')) return;
        topbarNav.classList.remove('open');
        topbarToggle.classList.remove('open');
        topbarToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- PAGE SWITCHING (menu navigation, no scroll) ---------- */
  const PAGE_IDS = ['beranda', 'profil', 'rancangan', 'pengalaman-s1', 'pengalaman-s2', 'karya-inovatif', 'refleksi-s1', 'refleksi-s2', 'refleksi', 'dokumentasi'];

  /* ---------- NAV DROPDOWNS ---------- */
  const navDropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));

  function closeSubmenu() {
    navDropdowns.forEach(function (dd) {
      const sub = dd.querySelector('.nav-submenu');
      const tog = dd.querySelector('.dropdown-toggle');
      if (sub) sub.classList.remove('open');
      if (tog) tog.classList.remove('open');
      if (!isDesktop && sub && sub.style.position === 'fixed') {
        sub.style.position = '';
      }
    });
  }

  function openSubmenu(dd) {
    const sub = dd.querySelector('.nav-submenu');
    const tog = dd.querySelector('.dropdown-toggle');
    if (!sub || !tog) return;
    if (isDesktop) {
      const r = tog.getBoundingClientRect();
      sub.style.position = 'fixed';
      sub.style.top = (r.bottom + 6) + 'px';
      sub.style.left = Math.max(8, r.left) + 'px';
      sub.style.minWidth = '230px';
    }
    sub.classList.add('open');
    tog.classList.add('open');
  }

  function toggleSubmenu(dd) {
    const sub = dd.querySelector('.nav-submenu');
    if (sub.classList.contains('open')) {
      closeSubmenu();
    } else {
      closeSubmenu();
      openSubmenu(dd);
    }
  }

  navDropdowns.forEach(function (dd) {
    const tog = dd.querySelector('.dropdown-toggle');
    if (!tog) return;
    tog.addEventListener('click', function (e) {
      e.preventDefault();
      toggleSubmenu(dd);
      if (!isDesktop) topbarNav.classList.add('open');
    });
  });
  document.addEventListener('click', function (e) {
    const insideAny = navDropdowns.some(function (dd) { return dd.contains(e.target); });
    if (!insideAny) closeSubmenu();
  });
  window.addEventListener('resize', function () {
    if (isDesktop) {
      navDropdowns.forEach(function (dd) {
        const sub = dd.querySelector('.nav-submenu');
        if (sub && sub.classList.contains('open')) openSubmenu(dd);
      });
    } else {
      navDropdowns.forEach(function (dd) {
        const sub = dd.querySelector('.nav-submenu');
        if (sub) sub.style.position = '';
      });
    }
  });
  window.addEventListener('scroll', closeSubmenu, { passive: true });

  function getPrimarySection(link) {
    return link.getAttribute('data-section').split(',')[0].trim();
  }
  function linkMatchesSection(link, id) {
    return link.getAttribute('data-section').split(',').map(function (s) { return s.trim(); }).indexOf(id) !== -1;
  }

  function setActiveLink(id) {
    navLinks.forEach(function (l) {
      l.classList.toggle('active', linkMatchesSection(l, id));
    });
  }

  function currentPageFromHash() {
    const h = window.location.hash.replace('#', '');
    return PAGE_IDS.indexOf(h) !== -1 ? h : 'beranda';
  }

  function showPage(id) {
    if (PAGE_IDS.indexOf(id) === -1) id = 'beranda';
    sections.forEach(function (s) {
      s.classList.toggle('page-active', s.id === id);
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
    setActiveLink(id);
    if (window.AOS) { AOS.refresh(); }
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (link.classList.contains('dropdown-toggle')) return;
      e.preventDefault();
      const id = getPrimarySection(link);
      if (window.location.hash !== '#' + id) {
        window.location.hash = id;
      }
      showPage(id);
      closeSubmenu();
      if (!isDesktop) closeMobileNav();
    });
  });

  window.addEventListener('hashchange', function () {
    showPage(currentPageFromHash());
    if (!isDesktop) closeMobileNav();
  });

  showPage(currentPageFromHash());

  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(function (l) {
          l.classList.toggle('active', linkMatchesSection(l, id));
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
  sections.forEach(function (s) { sectionObserver.observe(s); });

  /* ---------- THEME TOGGLE (in-memory, no storage) ---------- */
  let darkMode = false;
  themeToggle.addEventListener('click', function () {
    darkMode = !darkMode;
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    themeToggle.innerHTML = darkMode
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  });

  /* ---------- SCROLL EVENTS: progress bar, sticky header, fab top ---------- */
  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';

    fabTop.classList.toggle('show', scrollTop > 400);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  fabTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  fabHelp.addEventListener('click', function () {
    showPage('refleksi');
  });

  /* ---------- COUNTER ANIMATION ---------- */
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const duration = 1200;
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(function (c) { counterObserver.observe(c); });

  /* ---------- EFFECTIVENESS BARS ---------- */
  const bars = document.querySelectorAll('.bar');
  const barObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(function (b) { barObserver.observe(b); });

  /* ---------- LEARNING JOURNEY MODAL ---------- */
  const LEJ_DATA = {
    filosofi: {
      title: 'Filosofi Pendidikan dan Pendidikan Nilai',
      artifact: {
        label: 'Lihat/Unduh Artefak',
        url: 'https://drive.google.com/file/d/1Rc5ebKJVr9BJj-Tax2-2cNIPl5a17U3h/view?usp=drive_link'
      },
      blocks: [
        { icon: 'fa-link', heading: 'Connection (Keterhubungan)', html: [
          'Berdasarkan refleksi 4C pada mata kuliah Filosofi Pendidikan, saya memahami bahwa peran guru bukan hanya sebagai penyampai materi, tetapi sebagai pamong yang menuntun peserta didik sesuai potensi dan kebutuhannya. Pemikiran Ki Hadjar Dewantara menjadi landasan dalam melaksanakan pembelajaran yang berpusat pada peserta didik, kontekstual, dan membangun karakter.'
        ]},
        { icon: 'fa-triangle-exclamation', heading: 'Challenge (Tantangan)', html: [
          'Selama PPL di SMK Negeri 6 Makassar, pemahaman ini menjadi tantangan bagi saya untuk mengubah pembelajaran yang sebelumnya berorientasi pada hasil menjadi pembelajaran yang lebih bermakna melalui pengalaman langsung, khususnya pada bidang kuliner.'
        ]},
        { icon: 'fa-lightbulb', heading: 'Concept (Konsep)', html: [
          'Konsep penting yang saya terapkan adalah guru sebagai teladan melalui sistem Among, memahami kodrat alam dan zaman peserta didik, serta menciptakan pembelajaran yang menghubungkan materi dengan dunia nyata.'
        ]},
        { icon: 'fa-arrow-right-arrow-left', heading: 'Change (Perubahan)', html: [
          'Perubahan yang saya lakukan dalam PPL yaitu merancang pembelajaran yang lebih berpusat pada siswa, memberikan ruang kreativitas dalam praktik kuliner, mengembangkan karakter kerja seperti disiplin dan tanggung jawab, serta melakukan refleksi untuk meningkatkan kualitas pembelajaran.'
        ]}
      ]
    },
    pemahaman: {
      title: 'Pemahaman Peserta Didik dan Pembelajarannya',
      artifact: {
        label: 'Lihat/Unduh Artefak',
        url: 'https://drive.google.com/file/d/17MVyaiRm4JdSzYyI6e9tt0meUSSYteOy/view?usp=drive_link'
      },
      blocks: [
        { icon: 'fa-link', heading: 'Connection (Keterhubungan)', html: [
          'Pada mata kuliah Pemahaman Peserta Didik dan Pembelajarannya, saya memahami bahwa guru perlu mengenali karakteristik, kebutuhan, gaya belajar, serta tingkat kesiapan peserta didik sebelum merancang pembelajaran. Pemahaman terhadap perkembangan kognitif, sosial-emosional, dan latar belakang peserta didik menjadi dasar dalam menciptakan pembelajaran yang bermakna dan berkeadilan.'
        ]},
        { icon: 'fa-triangle-exclamation', heading: 'Challenge (Tantangan)', html: [
          'Selama PPL di SMK Negeri 6 Makassar, pemahaman ini menjadi tantangan bagi saya untuk mengubah pembelajaran yang sebelumnya cenderung menggunakan pendekatan yang sama kepada seluruh siswa menjadi pembelajaran yang lebih berdiferensiasi sesuai kebutuhan peserta didik.'
        ]},
        { icon: 'fa-lightbulb', heading: 'Concept (Konsep)', html: [
          'Konsep penting yang saya pelajari adalah asesmen diagnostik, pembelajaran berdiferensiasi, teori perkembangan peserta didik, serta pembelajaran kontekstual yang menghubungkan materi dengan pengalaman nyata siswa.'
        ]},
        { icon: 'fa-arrow-right-arrow-left', heading: 'Change (Perubahan)', html: [
          'Dalam praktik PPL bidang kuliner, konsep tersebut saya terapkan dengan melakukan pengamatan terhadap karakteristik siswa, memberikan pengalaman belajar melalui praktik langsung, memberikan pendampingan sesuai kemampuan siswa, serta menciptakan pembelajaran yang mendorong kreativitas dan kemandirian.',
          'Perubahan yang saya lakukan adalah menerapkan pembelajaran yang berpusat pada peserta didik dengan melakukan asesmen awal, menyusun strategi pembelajaran yang sesuai kebutuhan siswa, dan lebih memperhatikan perkembangan sosial-emosional mereka agar setiap peserta didik dapat berkembang secara optimal.'
        ]}
      ]
    },
    'pembelajaran-dasar': {
      title: 'Pembelajaran Mendalam dan Asesmen Dasar',
      artifact: {
        label: 'Lihat/Unduh Artefak',
        url: 'https://drive.google.com/file/d/1cTOJDHELSyXLrbSuq3tTGxaoctjkdbGD/view?usp=drive_link'
      },
      blocks: [
        { icon: 'fa-link', heading: 'Connection (Keterhubungan)', html: [
          'Berdasarkan refleksi 4C pada mata kuliah Pembelajaran Mendalam dan Asesmen, saya memahami bahwa pembelajaran yang bermakna tidak hanya berfokus pada penyampaian materi dan pencapaian kompetensi, tetapi juga bagaimana peserta didik mampu membangun pemahaman melalui pengalaman, diskusi, pemecahan masalah, dan refleksi. Materi ini memiliki keterkaitan erat dengan pengalaman PPL Mandiri di SMKN 6 Makassar, khususnya pada pembelajaran kuliner, karena peserta didik perlu diberikan kesempatan untuk menghadapi permasalahan nyata di dapur sehingga mampu berpikir kritis dan menemukan solusi berdasarkan pengalaman belajar mereka sendiri.'
        ]},
        { icon: 'fa-triangle-exclamation', heading: 'Challenge (Tantangan)', html: [
          'Tantangan yang saya alami adalah mengubah pembelajaran yang sebelumnya lebih berpusat pada guru menjadi pembelajaran yang berpusat pada peserta didik, terutama dalam praktik kuliner yang sering menggunakan pola demonstrasi dan meniru. Saya belajar bahwa setiap peserta didik memiliki kemampuan awal yang berbeda sehingga diperlukan pembelajaran yang fleksibel serta asesmen yang tidak hanya menilai hasil akhir produk, tetapi juga proses dan perkembangan keterampilan mereka.'
        ]},
        { icon: 'fa-lightbulb', heading: 'Concept (Konsep)', html: [
          'Konsep penting yang saya pelajari adalah bahwa Pembelajaran Mendalam menempatkan peserta didik sebagai subjek aktif yang membangun pengetahuan melalui pengalaman langsung, analisis, diskusi, refleksi, dan penerapan konsep dalam situasi nyata. Selain itu, asesmen harus menjadi bagian dari proses pembelajaran untuk memberikan umpan balik yang membantu perkembangan peserta didik.'
        ]},
        { icon: 'fa-arrow-right-arrow-left', heading: 'Change (Perubahan)', html: [
          'Dalam pengalaman PPL bidang kuliner, konsep tersebut saya terapkan dengan memberikan ruang kepada peserta didik untuk menganalisis kesalahan dalam praktik memasak, mencari penyebab, mencoba solusi, dan melakukan perbaikan.',
          'Perubahan yang saya lakukan adalah merancang pembelajaran yang lebih kontekstual berbasis masalah nyata, menerapkan asesmen diagnostik, formatif, dan sumatif secara terencana, serta menjadikan hasil asesmen sebagai dasar untuk memberikan umpan balik agar peserta didik tidak hanya memiliki keterampilan teknis, tetapi juga kemampuan berpikir kritis dan kesiapan menghadapi dunia industri kuliner.'
        ]}
      ]
    },
    'ppl-terbimbing': {
      title: 'Praktik Pengalaman Lapangan Terbimbing',
      artifact: {
        label: 'Lihat/Unduh Artefak',
        url: 'https://drive.google.com/file/d/1xnys3OJWUTAOnqb-MC4zmBPfFiqCigTB/view?usp=drive_link'
      },
      blocks: [
        { icon: 'fa-link', heading: 'Connection (Keterhubungan)', html: [
          'Berdasarkan refleksi 4C pada mata kuliah PPL Terbimbing, saya memahami bahwa kegiatan PPL menjadi pengalaman nyata untuk menghubungkan teori pedagogik yang telah dipelajari dengan praktik pembelajaran di kelas. Melalui PPL, saya belajar mengelola kelas, menerapkan model pembelajaran, serta membangun interaksi dengan peserta didik yang memiliki karakter, kebutuhan, dan gaya belajar yang beragam. Pengalaman ini menyadarkan saya bahwa menjadi guru profesional tidak hanya membutuhkan penguasaan teori, tetapi juga kemampuan membaca situasi, beradaptasi, dan mengambil keputusan sesuai kondisi nyata di kelas.'
        ]},
        { icon: 'fa-triangle-exclamation', heading: 'Challenge (Tantangan)', html: [
          'Tantangan yang saya alami selama PPL adalah menghadapi dinamika pembelajaran yang tidak selalu sesuai dengan rencana dalam Modul Ajar, seperti perbedaan konsentrasi, kondisi peserta didik, dan situasi kelas yang berubah. Hal ini mengajarkan saya pentingnya fleksibilitas dalam menerapkan pembelajaran serta kemampuan menyesuaikan strategi agar kebutuhan belajar peserta didik tetap terpenuhi.'
        ]},
        { icon: 'fa-lightbulb', heading: 'Concept (Konsep)', html: [
          'Konsep penting yang saya peroleh adalah pentingnya refleksi berkelanjutan, manajemen kelas yang konstruktif, serta kolaborasi dengan Guru Pamong dan rekan sejawat dalam meningkatkan kualitas pembelajaran.'
        ]},
        { icon: 'fa-arrow-right-arrow-left', heading: 'Change (Perubahan)', html: [
          'Dalam pengalaman PPL di SMK Negeri 6 Makassar pada bidang kuliner, konsep tersebut saya terapkan dengan melakukan evaluasi terhadap proses mengajar, memperbaiki modul ajar berdasarkan masukan, serta memberikan pendampingan kepada peserta didik selama praktik agar pembelajaran lebih efektif.',
          'Perubahan yang saya lakukan adalah merancang pembelajaran yang lebih adaptif, meningkatkan kemampuan asesmen formatif selama proses belajar, dan menjadikan setiap pengalaman mengajar sebagai proses refleksi untuk terus berkembang menjadi guru yang lebih profesional.'
        ]}
      ]
    },
    growth: {
      title: 'Pola Pikir Bertumbuh (Growth Mindset)',
      artifact: {
        label: 'Lihat/Unduh Artefak',
        url: 'https://drive.google.com/file/d/1YmTTb4tGgyOHxoMKtNIM1wLzAFcD-wg6/view?usp=drive_link'
      },
      blocks: [
        { icon: 'fa-link', heading: 'Connection (Keterhubungan)', html: [
          'Berdasarkan refleksi 4C pada mata kuliah Growth Mindset, saya memahami bahwa seorang guru perlu memiliki pola pikir bertumbuh dengan melihat tantangan, kesalahan, dan proses belajar sebagai kesempatan untuk berkembang. Materi ini berkaitan dengan peran saya sebagai calon guru karena mengajarkan pentingnya membangun budaya belajar yang mendorong peserta didik untuk terus mencoba, berusaha, dan berkembang melalui pengalaman belajar.'
        ]},
        { icon: 'fa-triangle-exclamation', heading: 'Challenge (Tantangan)', html: [
          'Selama PPL di SMK Negeri 6 Makassar, pemahaman ini menjadi tantangan bagi saya untuk mengubah cara pandang terhadap kemampuan peserta didik, bahwa kesulitan dalam praktik bukan semata-mata karena rendahnya kemampuan, tetapi dapat diperbaiki melalui dukungan, latihan, dan umpan balik yang konstruktif.'
        ]},
        { icon: 'fa-lightbulb', heading: 'Concept (Konsep)', html: [
          'Konsep penting yang saya pelajari adalah perbedaan fixed mindset dan growth mindset, yaitu keyakinan bahwa kemampuan seseorang dapat berkembang melalui usaha, strategi yang tepat, latihan, kolaborasi, dan refleksi.'
        ]},
        { icon: 'fa-arrow-right-arrow-left', heading: 'Change (Perubahan)', html: [
          'Dalam pengalaman PPL bidang kuliner, konsep ini saya terapkan dengan memberikan kesempatan kepada peserta didik untuk belajar dari kesalahan saat praktik, mencoba kembali proses pembuatan produk, serta memberikan apresiasi terhadap usaha dan perkembangan mereka.',
          'Perubahan yang saya lakukan adalah membangun pembelajaran yang lebih menghargai proses daripada hanya hasil akhir, menggunakan bahasa yang positif, memberikan motivasi, dan menciptakan lingkungan belajar yang membuat peserta didik percaya bahwa kemampuan mereka dapat terus berkembang melalui latihan dan pengalaman.'
        ]}
      ]
    },
    'design-thinking': {
      title: 'Design Thinking',
      artifact: {
        label: 'Lihat/Unduh Artefak',
        url: 'https://drive.google.com/file/d/1SxM9gLzwkJKo4bJg2hfa6Uk-E8jAEwbR/view?usp=drive_link'
      },
      blocks: [
        { icon: 'fa-link', heading: 'Connection (Keterhubungan)', html: [
          'Berdasarkan refleksi 4C pada mata kuliah Design Thinking, saya memahami bahwa seorang guru perlu memiliki kemampuan dalam menyelesaikan permasalahan pembelajaran melalui pendekatan yang berpusat pada kebutuhan peserta didik. Materi ini sangat berkaitan dengan pengalaman PPL di SMK Negeri 6 Makassar, khususnya dalam pembelajaran kuliner, karena saya menemukan berbagai permasalahan seperti perbedaan kemampuan awal, motivasi belajar, dan partisipasi peserta didik saat praktik. Melalui Design Thinking, saya belajar bahwa guru perlu membangun empati melalui observasi, komunikasi, dan identifikasi kebutuhan siswa sebelum menentukan solusi pembelajaran.'
        ]},
        { icon: 'fa-triangle-exclamation', heading: 'Challenge (Tantangan)', html: [
          'Tantangan yang saya alami adalah mengubah kebiasaan dalam menyelesaikan masalah secara langsung tanpa menganalisis akar permasalahan terlebih dahulu. Saya mulai memahami bahwa solusi pembelajaran yang efektif perlu melalui proses memahami masalah, mencari ide, membuat rancangan solusi, serta melakukan perbaikan berdasarkan umpan balik.'
        ]},
        { icon: 'fa-lightbulb', heading: 'Concept (Konsep)', html: [
          'Konsep penting yang saya pelajari adalah tahapan Design Thinking yaitu empathize, define, ideate, prototype, dan test, yang membantu guru merancang pembelajaran secara kreatif, reflektif, dan sesuai kebutuhan peserta didik.'
        ]},
        { icon: 'fa-arrow-right-arrow-left', heading: 'Change (Perubahan)', html: [
          'Dalam pengalaman PPL bidang kuliner, konsep ini saya terapkan dengan mengidentifikasi kesulitan siswa saat praktik, merancang pendampingan bertahap, memberikan kesempatan mencoba kembali, serta menciptakan solusi pembelajaran yang lebih inovatif.',
          'Perubahan yang saya lakukan adalah menerapkan pembelajaran yang lebih berpusat pada peserta didik, menjadikan guru sebagai fasilitator yang mendengarkan, menguji, dan menyempurnakan solusi bersama siswa agar pembelajaran menjadi lebih bermakna.'
        ]}
      ]
    },
    pse: {
      title: 'Pembelajaran Sosial Emosional (PSE)',
      artifact: {
        label: 'Lihat/Unduh Artefak',
        url: 'https://drive.google.com/file/d/1UvXEjb-UhsPeKM64VbMb17ZLDe0Y4kuu/view?pli=1'
      },
      blocks: [
        { icon: 'fa-link', heading: 'Connection (Keterhubungan)', html: [
          'Berdasarkan refleksi 4C pada mata kuliah Pembelajaran Sosial Emosional, saya memahami bahwa kesejahteraan emosional guru dan peserta didik menjadi kunci keberhasilan pembelajaran yang bermakna. Mempelajari lima kompetensi sosial emosional membantu saya menciptakan lingkungan belajar yang aman, nyaman, dan berpihak pada murid.'
        ]},
        { icon: 'fa-triangle-exclamation', heading: 'Challenge (Tantangan)', html: [
          'Tantangannya adalah mengelola emosi dalam kelas yang dinamis serta membangun kelas yang inklusif bagi peserta didik dengan latar belakang dan kebutuhan yang beragam.'
        ]},
        { icon: 'fa-lightbulb', heading: 'Concept (Konsep)', html: [
          'Konsep penting yang saya pelajari adalah lima kompetensi sosial emosional, yaitu kesadaran diri, manajemen diri, kesadaran sosial, keterampilan berelasi, dan pengambilan keputusan yang bertanggung jawab.'
        ]},
        { icon: 'fa-arrow-right-arrow-left', heading: 'Change (Perubahan)', html: [
          'Dalam praktik, konsep ini saya terapkan dengan mengintegrasikan PSE dalam rutinitas kelas, kegiatan ice breaking, dan kesadaran diri pada awal pembelajaran agar suasana belajar lebih aman dan nyaman.'
        ]}
      ]
    },
    'asesmen-lanjut': {
      title: 'Pembelajaran Mendalam dan Asesmen Lanjut',
      artifact: {
        label: 'Lihat/Unduh Artefak',
        url: 'https://drive.google.com/file/d/10FdGLUPuTnf4PThCNWKdeA75XBwE6syu/view'
      },
      blocks: [
        { icon: 'fa-link', heading: 'Connection (Keterhubungan)', html: [
          'Berdasarkan refleksi 4C pada mata kuliah Pembelajaran Mendalam dan Asesmen Lanjut, saya memahami bahwa asesmen tidak hanya menilai hasil, tetapi menjadi bagian dari proses untuk meningkatkan kualitas pembelajaran.'
        ]},
        { icon: 'fa-triangle-exclamation', heading: 'Challenge (Tantangan)', html: [
          'Tantangannya adalah merancang asesmen lanjutan yang bervariasi dan mengolah data hasil belajar menjadi keputusan pedagogis yang tepat sasaran bagi setiap peserta didik.'
        ]},
        { icon: 'fa-lightbulb', heading: 'Concept (Konsep)', html: [
          'Konsep penting yang saya pelajari adalah asesmen berkelanjutan, analisis hasil belajar, serta tindak lanjut berupa pengayaan dan remedial yang berbasis data.'
        ]},
        { icon: 'fa-arrow-right-arrow-left', heading: 'Change (Perubahan)', html: [
          'Dalam praktik, konsep ini saya terapkan dengan menyusun instrumen asesmen sumatif dan melakukan analisis hasil belajar pada akhir modul sebagai dasar perbaikan pembelajaran.'
        ]}
      ]
    },
    'ppl-mandiri': {
      title: 'Praktik Pengalaman Lapangan Mandiri',
      artifact: {
        label: 'Lihat/Unduh Artefak',
        url: 'https://drive.google.com/file/d/13_RgdDqhSHqrHqp_r_rUZfdl6Y3k8HcY/view'
      },
      blocks: [
        { icon: 'fa-link', heading: 'Connection (Keterhubungan)', html: [
          'Berdasarkan refleksi 4C pada mata kuliah Praktik Pengalaman Lapangan Mandiri, saya memahami bahwa PPL Mandiri menjadi puncak pengalaman untuk melaksanakan pembelajaran secara penuh di SMK Negeri 6 Makassar, dari perencanaan hingga evaluasi.'
        ]},
        { icon: 'fa-triangle-exclamation', heading: 'Challenge (Tantangan)', html: [
          'Tantangannya adalah mengasah kemandirian, manajemen kelas yang kompleks, dan pengambilan keputusan pedagogis secara langsung tanpa pendampingan penuh.'
        ]},
        { icon: 'fa-lightbulb', heading: 'Concept (Konsep)', html: [
          'Konsep penting yang saya pelajari adalah perencanaan pembelajaran yang utuh, pelaksanaan pembelajaran yang adaptif, dan evaluasi yang berkelanjutan.'
        ]},
        { icon: 'fa-arrow-right-arrow-left', heading: 'Change (Perubahan)', html: [
          'Perubahan yang saya lakukan adalah mampu mengelola pembelajaran secara mandiri dan menghasilkan perangkat ajar utuh, mulai dari modul ajar, LKPD, video mengajar, hingga instrumen penilaian.'
        ]}
      ]
    },
    kepemimpinan: {
      title: 'Proyek Kepemimpinan',
      artifact: {
        label: 'Lihat/Unduh Artefak',
        url: 'https://drive.google.com/file/d/1Xq08b8ZxU29byib0uark2-4lVvqSjbDd/view'
      },
      blocks: [
        { icon: 'fa-link', heading: 'Connection (Keterhubungan)', html: [
          'Berdasarkan refleksi 4C pada mata kuliah Proyek Kepemimpinan, saya memahami bahwa kepemimpinan pendidikan bukan sekadar jabatan, melainkan kemampuan menggerakkan orang lain menuju perubahan yang lebih baik dan berdampak.'
        ]},
        { icon: 'fa-triangle-exclamation', heading: 'Challenge (Tantangan)', html: [
          'Tantangannya adalah merancang dan menjalankan proyek kepemimpinan yang berdampak bagi komunitas sekolah maupun masyarakat sekitar dalam keterbatasan waktu dan sumber daya.'
        ]},
        { icon: 'fa-lightbulb', heading: 'Concept (Konsep)', html: [
          'Konsep penting yang saya pelajari adalah kepemimpinan melalui teladan dan kolaborasi yang efektif dengan seluruh pemangku kepentingan sekolah.'
        ]},
        { icon: 'fa-arrow-right-arrow-left', heading: 'Change (Perubahan)', html: [
          'Perubahan yang saya lakukan adalah mampu memimpin proyek, mendokumentasikan pelaksanaan dan dampaknya, serta membangun kolaborasi yang efektif dengan pihak terkait.'
        ]}
      ]
    },
    edupreneurship: {
      title: 'Edupreneurship',
      artifact: {
        label: 'Lihat/Unduh Artefak',
        url: 'https://drive.google.com/file/d/1VyPiNVq6peiHIr8R35TcpAMcQr41D7kN/view'
      },
      blocks: [
        { icon: 'fa-link', heading: 'Connection (Keterhubungan)', html: [
          'Berdasarkan refleksi 4C pada mata kuliah Edupreneurship, saya memahami bahwa guru perlu berinovasi dan menciptakan nilai, baik bagi pembelajaran maupun bagi pengembangan dirinya, dengan menumbuhkan jiwa kewirausahaan dalam konteks pendidikan.'
        ]},
        { icon: 'fa-triangle-exclamation', heading: 'Challenge (Tantangan)', html: [
          'Tantangannya adalah mengubah pola pikir agar berani mencoba, kreatif, dan mampu menciptakan peluang yang bernilai dari keterbatasan yang ada di sekolah.'
        ]},
        { icon: 'fa-lightbulb', heading: 'Concept (Konsep)', html: [
          'Konsep penting yang saya pelajari adalah jiwa kewirausahaan sebagai penguatan keterampilan abad 21 peserta didik, meliputi kreativitas, kemandirian, dan keberanian mengambil inisiatif.'
        ]},
        { icon: 'fa-arrow-right-arrow-left', heading: 'Change (Perubahan)', html: [
          'Perubahan yang saya lakukan adalah merancang konsep proyek edupreneurship sebagai penguatan keterampilan abad 21 dan menciptakan nilai bagi lingkungan sekolah.'
        ]}
      ]
    },
    pencegahan: {
      title: 'Pencegahan dan Penanganan Kekerasan',
      blocks: [
        { icon: 'fa-book-open', heading: 'Reviu Pengalaman Belajar', html: [
          'Mempelajari regulasi, prosedur, dan peran guru dalam mencegah serta menangani kekerasan di lingkungan satuan pendidikan.'
        ]},
        { icon: 'fa-brain', heading: 'Refleksi Pengalaman', html: [
          'Sekolah harus menjadi ruang yang aman, nyaman, dan ramah anak bagi seluruh warga sekolah.'
        ]},
        { icon: 'fa-folder-open', heading: 'Analisis Artefak', html: [
          'Rencana aksi pencegahan kekerasan dan pembuatan komitmen bersama komunitas sekolah.'
        ]},
        { icon: 'fa-lightbulb', heading: 'Rumusan Hasil Refleksi', html: [
          '<ul><li><i class="fa-solid fa-check"></i> Membangun budaya sekolah yang positif.</li><li><i class="fa-solid fa-check"></i> Tanggap dan peduli terhadap peserta didik.</li></ul>'
        ]}
      ]
    },
    'refleksi-kegiatan': {
      title: 'Refleksi Kegiatan PPG',
      artifact: {
        label: 'Lihat/Unduh LK 3 Refleksi Keseluruhan',
        url: 'https://drive.google.com/file/d/17VwsZVBRzhrzYaxPiQoLhcZu55ePmdCP/view'
      },
      blocks: [
        { icon: 'fa-book-open', heading: 'Refleksi Keseluruhan', html: [
          'Refleksi keseluruhan selama mengikuti PPG semester 1 dan 2 memberikan pemahaman bahwa pendidikan di Indonesia harus merata, bermutu, dan berpihak pada kebutuhan setiap murid. Guru tidak hanya bertugas menyampaikan materi, tetapi juga memahami karakteristik, potensi, dan kebutuhan murid, menciptakan lingkungan belajar yang aman, nyaman, dan menyenangkan, serta menumbuhkan motivasi dan semangat belajar mereka.',
          'Untuk menjadi guru profesional, saya perlu terus mengembangkan kompetensi, berinovasi dalam pembelajaran, terbuka terhadap kritik dan saran, serta melakukan refleksi secara berkelanjutan. Tiga hal utama yang akan saya lakukan saat memulai karier sebagai guru adalah mengenal dan memahami murid, menciptakan lingkungan belajar yang positif, serta terus belajar dan memperbaiki diri agar dapat menghadirkan pembelajaran yang bermakna dan memberikan kesempatan bagi setiap murid untuk berkembang secara optimal.'
        ]}
      ]
    }
  };

  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  function openLejModal(mkId) {
    const data = LEJ_DATA[mkId];
    if (!data) return;
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.blocks.map(function (b) {
      return '<div class="lej-modal-block">' +
        '<h4><i class="fa-solid ' + b.icon + '"></i> ' + b.heading + '</h4>' +
        b.html.map(function (p) { return '<p>' + p + '</p>'; }).join('') +
        '</div>';
    }).join('');
    if (data.artifact) {
      modalBody.insertAdjacentHTML('beforeend',
        '<div class="lej-modal-artifact"><a class="btn btn-primary" target="_blank" rel="noopener" href="' + data.artifact.url + '">' +
        '<i class="fa-solid fa-download"></i> ' + data.artifact.label + '</a></div>');
    }
    modalOverlay.classList.add('show');
  }

  document.querySelectorAll('.lej-more[data-mk]').forEach(function (btn) {
    btn.addEventListener('click', function () { openLejModal(btn.getAttribute('data-mk')); });
  });

  function closeModal() { modalOverlay.classList.remove('show'); }
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- HERO SCREENSAVER (rotating background photos) ---------- */
  const SCREENSAVER_PHOTOS = [
    'assets/beranda/1.jpg',
    'assets/beranda/2.jpeg',
    'assets/beranda/3.jpeg',
    'assets/beranda/4.jpeg',
    'assets/beranda/5.jpeg',
    'assets/beranda/6.jpeg'
  ];

  let ssIndex = 0;
  let ssTimer = null;

  function renderScreensaver() {
    const background = document.getElementById('ssBackground');
    if (!background) return;

    background.innerHTML = SCREENSAVER_PHOTOS.map(function (src, i) {
      return '<div class="ss-bg-layer' + (i === 0 ? ' active' : '') + '"' +
        ' style="background-image:url(\'' + src + '\');"></div>';
    }).join('');

    startScreensaver();
  }

  function startScreensaver() {
    const background = document.getElementById('ssBackground');
    if (!background || SCREENSAVER_PHOTOS.length < 2) return;
    stopScreensaver();
    ssTimer = setInterval(function () {
      ssIndex = (ssIndex + 1) % SCREENSAVER_PHOTOS.length;
      background.querySelectorAll('.ss-bg-layer').forEach(function (layer, i) {
        layer.classList.toggle('active', i === ssIndex);
      });
    }, 4000);
  }

  function stopScreensaver() {
    if (ssTimer) {
      clearInterval(ssTimer);
      ssTimer = null;
    }
  }

  renderScreensaver();

  /* ---------- RIPPLE EFFECT ---------- */
  document.querySelectorAll('.ripple-target').forEach(function (el) {
    el.addEventListener('click', function (e) {
      const rect = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      el.style.position = 'relative';
      el.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);
    });
  });

  /* ---------- LIGHTBOX GALERI ---------- */
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  let lightboxEl, lightboxImg, lightboxClose, lightboxPrev, lightboxNext;
  let currentIndex = -1;

  function ensureLightbox() {
    if (lightboxEl) return;
    lightboxEl = document.createElement('div');
    lightboxEl.className = 'lightbox';
    lightboxEl.innerHTML =
      '<button class="lightbox-close" aria-label="Tutup">&times;</button>' +
      '<button class="lightbox-prev" aria-label="Sebelumnya">&#10094;</button>' +
      '<button class="lightbox-next" aria-label="Berikutnya">&#10095;</button>' +
      '<figure class="lightbox-figure"><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(lightboxEl);
    lightboxImg = lightboxEl.querySelector('img');
    lightboxClose = lightboxEl.querySelector('.lightbox-close');
    lightboxPrev = lightboxEl.querySelector('.lightbox-prev');
    lightboxNext = lightboxEl.querySelector('.lightbox-next');
    const caption = lightboxEl.querySelector('figcaption');

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', function (e) { e.stopPropagation(); showLightbox(currentIndex - 1); });
    lightboxNext.addEventListener('click', function (e) { e.stopPropagation(); showLightbox(currentIndex + 1); });
    lightboxEl.addEventListener('click', function (e) { if (e.target === lightboxEl) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (!lightboxEl.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') { showLightbox(currentIndex - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { showLightbox(currentIndex + 1); e.preventDefault(); }
    });

    function showLightbox(idx) {
      const items = galleryItems.filter(function (i) { return i.closest('#dokumentasi'); });
      currentIndex = (idx + items.length) % items.length;
      const item = items[currentIndex];
      lightboxImg.src = item.href;
      lightboxImg.alt = item.querySelector('img').alt;
      caption.textContent = item.dataset.alt || '';
      lightboxPrev.style.display = items.length > 1 ? '' : 'none';
      lightboxNext.style.display = items.length > 1 ? '' : 'none';
      lightboxEl.classList.add('open');
    }

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        showLightbox(galleryItems.indexOf(item));
      });
    });
  }

  function closeLightbox() {
    if (lightboxEl) {
      lightboxEl.classList.remove('open');
      lightboxImg.src = '';
    }
  }

  ensureLightbox();

  /* ---------- READ MORE (MY GROWTH JOURNEY) ---------- */
  document.querySelectorAll('.mgj-toggle').forEach(function (btn) {
    const more = document.getElementById(btn.getAttribute('data-target'));
    if (!more) return;
    const closedLabel = btn.innerHTML;
    btn.addEventListener('click', function () {
      const isHidden = more.style.display === 'none';
      more.style.display = isHidden ? 'block' : 'none';
      btn.innerHTML = isHidden
        ? '<i class="fa-solid fa-chevron-up"></i> Tutup'
        : closedLabel;
    });
  });

  /* ---------- VIDEO UPLOAD (LOCAL PREVIEW) ---------- */
  document.querySelectorAll('.video-upload input[type="file"]').forEach(function (input) {
    input.addEventListener('change', function () {
      const file = input.files && input.files[0];
      const player = input.closest('.video-slot').querySelector('video');
      if (!file || !player) return;
      if (player.src) URL.revokeObjectURL(player.src);
      player.src = URL.createObjectURL(file);
    });
  });

});
