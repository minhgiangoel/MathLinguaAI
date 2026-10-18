(() => {
  const A = 'assets/';
  const NAV = {
    home:    { left: 27.35, width: 9.45, en: 'Home', vi: 'Trang chủ', icon: '🏠' },
    topics:  { left: 37.35, width: 11.55, en: 'Topics Library', vi: 'Thư viện chủ đề', icon: '📚' },
    mathlab: { left: 49.05, width: 10.25, en: 'Math Lab', vi: 'Vui học Toán', icon: '🧪' },
    buddy:   { left: 59.55, width: 11.3, en: 'MathBuddy AI', vi: 'Trợ lí Toán học', icon: '🤖' },
    progress:{ left: 70.95, width: 11.0, en: 'My Progress', vi: 'Hồ sơ tiến bộ', icon: '📊' },
  };
  const PAGE_META = {
    home: { src: 'home.svg', alt: 'Trang chủ MathLingua AI Grade 5', className: 'home-board' },
    topics: { src: 'topics.svg', alt: 'Thư viện chủ đề với các hành tinh Fraction, Decimal Numbers, Ratio and Percentage, Geometry and Measurement', className: 'topics-board' },
    mathlab: { src: 'math-lab.svg', alt: 'Math Lab với các trò chơi Toán học tương tác', className: 'mathlab-board' },
    buddy: { src: 'mathbuddy-ai.svg', alt: 'Math Vocabulary và Speak and Pronounce', className: 'buddy-board' },
    progress: { src: 'my-progress.svg', alt: 'Hồ sơ tiến bộ MathLingua AI', className: 'progress-board' },
    chapter1: { src: 'chapter-1-fraction.svg', alt: 'Chủ đề Fraction, gồm Mixed Numbers và Decimal Fractions', className: 'chapter-board' },
    chapter2: { src: 'chapter-2-decimals.svg', alt: 'Chủ đề Decimal Numbers với bảy bài học', className: 'chapter-board' },
    chapter3: { src: 'chapter-3-ratio.svg', alt: 'Chủ đề Ratio and Percentage', className: 'chapter-board' },
    chapter4: { src: 'chapter-4-geometry.svg', alt: 'Chủ đề Geometry and Measurement', className: 'chapter-board' },
  };
  const routeState = {
    home: 'home', topics: 'topics', mathlab: 'mathlab', buddy: 'buddy', progress: 'progress',
    chapter1: 'topics', chapter2: 'topics', chapter3: 'topics', chapter4: 'topics'
  };
  const root = document.getElementById('app-content');
  const navVisual = document.getElementById('nav-visual-overlays');
  const navHotspots = document.getElementById('nav-hotspots');
  const modalRoot = document.getElementById('modal-root');
  let currentRoute = 'home';
  let modalReturnFocus = null;

  const lessonData = {
    chapter1: [
      { en: 'Mixed Numbers', vi: 'Hỗn số', x: 0.16, y: 0.62, w: 0.25, h: 0.15 },
      { en: 'Decimal Fractions', vi: 'Phân số thập phân', x: 0.42, y: 0.62, w: 0.27, h: 0.15 },
    ],
    chapter2: [
      ['Decimal Numbers','Số thập phân'],
      ['Comparing Decimal Numbers','So sánh các số thập phân'],
      ['Writing Length Measurements as Decimals','Viết số đo độ dài dưới dạng số thập phân'],
      ['Writing Mass Measurements as Decimals','Viết số đo khối lượng dưới dạng số thập phân'],
      ['Writing Area Measurements as Decimals','Viết số đo diện tích dưới dạng số thập phân'],
      ['Rounding Decimal Numbers','Làm tròn số thập phân'],
      ['Operations with Decimal Numbers','Các phép tính với số thập phân'],
    ].map((d,i)=>({en:d[0],vi:d[1],x:0.005+i*(0.1427),y:0.575,w:0.137,h:0.165})),
    chapter3: [
      ['Ratio','Tỉ số'], ['Word Problems about Ratio','Bài toán về tỉ số'], ['Percentage','Tỉ số phần trăm'],
      ['Percentage of a Number','Tìm tỉ số phần trăm của một số'], ['Map Scale','Tỉ lệ bản đồ'],
    ].map((d,i)=>({en:d[0],vi:d[1],x:i*0.2+0.005,y:0.56,w:0.19,h:0.19})),
    chapter4: [
      ['Hectare and Square Kilometre','Héc-ta và ki-lô-mét vuông'], ['Area of Triangle','Diện tích hình tam giác'], ['Trapezium and Area of Trapezium','Hình thang và diện tích hình thang'], ['Circumference and Area of a Circle','Chu vi và diện tích hình tròn'],
      ['Nets of Solid','Hình khai triển của hình khối'], ['Lateral Area and Surface Area of Cuboid, Cube','Diện tích xung quanh và diện tích toàn phần'], ['Units of Volume','Đơn vị đo thể tích'], ['Volume of Cuboid and Cube','Thể tích hình hộp chữ nhật và hình lập phương'],
      ['Adding and Subtracting Time','Cộng và trừ số đo thời gian'], ['Multiplying and Dividing Time','Nhân và chia số đo thời gian'], ['Speed','Vận tốc'], ['Speed, Time and Distance Formula','Công thức tính quãng đường, vận tốc và thời gian'],
      ['Pie Chart','Biểu đồ hình quạt tròn']
    ].map((d,i)=>{
      const row = i < 4 ? 0 : i < 8 ? 1 : i < 12 ? 2 : i === 12 ? 4 : 3;
      const col = i < 4 ? i : i < 8 ? i-4 : i < 12 ? i-8 : 0;
      const tops = [0.365,0.49,0.615,0.74,0.86];
      return { en:d[0],vi:d[1],x:col*0.25+0.008,y:tops[row],w:0.235,h:row===4?0.12:0.115 };
    })
  };

  function currentHashRoute() {
    const key = (location.hash || '#home').replace(/^#\/?/, '').split('/')[0];
    return PAGE_META[key] ? key : 'home';
  }

  function navigate(route, push = true) {
    if (!PAGE_META[route]) route = 'home';
    if (push && location.hash !== `#${route}`) history.pushState({route}, '', `#${route}`);
    currentRoute = route;
    renderNav();
    renderPage();
    closeModal(false);
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  function navActiveRoute() { return routeState[currentRoute] || 'home'; }

  function renderNav() {
    navVisual.innerHTML = '';
    navHotspots.innerHTML = '';
    const active = navActiveRoute();
    if (active !== 'home') {
      const mask = document.createElement('div');
      mask.className = 'home-tab-mask';
      navVisual.appendChild(mask);
      drawNavTab('home', false);
      const n = NAV[active];
      const plate = document.createElement('div');
      plate.className = 'nav-active-plate';
      plate.style.left = `${n.left}%`;
      plate.style.width = `${n.width}%`;
      navVisual.appendChild(plate);
      drawNavTab(active, true);
    }

    // Clickable hotspots are separate DOM elements over the supplied shared-header artwork.
    addNavHotspot('brand-home', 0.4, 4, 26, 92, () => navigate('home'), 'MathLingua AI — Trang chủ / Home');
    Object.entries(NAV).forEach(([route, n]) => {
      addNavHotspot(`nav-${route}`, n.left, 9, n.width, 82, () => navigate(route), `${n.en} / ${n.vi}`);
    });
    addNavHotspot('nav-login', 82.4, 9, 16.2, 82, openLogin, 'Log in / Đăng nhập');
  }

  function drawNavTab(route, isActive) {
    const n = NAV[route];
    const d = document.createElement('div');
    d.className = `nav-redraw ${isActive ? 'active' : 'inactive'}`;
    d.style.left = `${n.left}%`;
    d.style.width = `${n.width}%`;
    d.innerHTML = `<span class="nav-emoji">${n.icon}</span><span class="nav-en">${n.en}</span><span class="nav-vi">${n.vi}</span>`;
    navVisual.appendChild(d);
  }

  function addNavHotspot(id, left, top, width, height, action, label) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'nav-hotspot'; b.id = id;
    b.style.left = `${left}%`; b.style.top = `${top}%`; b.style.width = `${width}%`; b.style.height = `${height}%`;
    b.setAttribute('aria-label', label); b.title = label;
    b.addEventListener('click', action);
    navHotspots.appendChild(b);
  }

  function addHotspot(board, spec) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `hotspot${spec.className ? ' ' + spec.className : ''}`;
    b.style.left = `${spec.x * 100}%`;
    b.style.top = `${spec.y * 100}%`;
    b.style.width = `${spec.w * 100}%`;
    b.style.height = `${spec.h * 100}%`;
    b.setAttribute('aria-label', spec.label || spec.title || 'Mở nội dung');
    b.title = spec.label || spec.title || 'Mở nội dung';
    if (spec.visibleText) b.innerHTML = spec.visibleText;
    b.addEventListener('click', () => runHotspot(spec));
    board.appendChild(b);
  }

  function renderPage() {
    const meta = PAGE_META[currentRoute];
    root.innerHTML = '';
    const scroll = document.createElement('div');
    scroll.className = 'stage-scroll';
    const board = document.createElement('section');
    board.className = `artboard ${meta.className || ''}`;
    board.setAttribute('aria-label', meta.alt);
    const img = document.createElement('img');
    img.src = A + meta.src; img.alt = meta.alt; img.draggable = false;
    img.decoding = 'async';
    board.appendChild(img);
    scroll.appendChild(board);
    root.appendChild(scroll);

    if (currentRoute === 'home') {
      addHotspot(board, {x:.495,y:.645,w:.265,h:.105,route:'topics',label:'Bắt đầu hành trình / Start your journey'});
    } else if (currentRoute === 'topics') {
      // Four topic planets on the supplied Topics Library illustration.
      addHotspot(board, {x:.345,y:.145,w:.355,h:.315,route:'chapter1',label:'Fraction / Phân số'});
      addHotspot(board, {x:.677,y:.137,w:.31,h:.345,route:'chapter2',label:'Decimal Numbers / Số thập phân'});
      addHotspot(board, {x:.365,y:.48,w:.32,h:.30,route:'chapter3',label:'Ratio and Percentage / Tỉ số và tỉ số phần trăm'});
      addHotspot(board, {x:.70,y:.48,w:.29,h:.31,route:'chapter4',label:'Geometry and Measurement / Hình học và đo lường'});
    } else if (currentRoute === 'mathlab') {
      const games = [
        {x:.012,y:.13,w:.33,h:.20,game:'shapes',title:'3D Shape Studio',vi:'Xưởng hình khối 3D'},
        {x:.35,y:.13,w:.32,h:.20,game:'mixed',title:'Mixed Number Adventure',vi:'Phiêu lưu cùng hỗn số'},
        {x:.67,y:.13,w:.32,h:.20,game:'mystery',title:'Mystery Pieces',vi:'Mảnh ghép bí ẩn'},
        {x:.02,y:.37,w:.28,h:.22,game:'candy',title:'Candy Stacker',vi:'Xếp kẹo'},
        {x:.31,y:.37,w:.37,h:.22,game:'dragdrop',title:'Drag and Drop',vi:'Kéo thả đúng chỗ'},
        {x:.69,y:.37,w:.29,h:.22,game:'ants',title:'Ants Food Quest',vi:'Kiến tha mồi'},
      ];
      games.forEach(g=>addHotspot(board,{...g,label:`Start: ${g.title} / ${g.vi}`}));
    } else if (currentRoute === 'buddy') {
      const vocab = [
        {x:.245,y:.20,w:.115,h:.30,en:'Geometry',vi:'Hình học'},
        {x:.36,y:.20,w:.115,h:.30,en:'Measurement',vi:'Đo lường'},
        {x:.475,y:.20,w:.12,h:.30,en:'Decimal Numbers',vi:'Số thập phân'},
        {x:.245,y:.51,w:.12,h:.29,en:'Mixed Numbers',vi:'Hỗn số'},
        {x:.365,y:.51,w:.115,h:.29,en:'Ratio',vi:'Tỉ số'},
        {x:.48,y:.51,w:.12,h:.29,en:'Others',vi:'Khác'},
      ];
      vocab.forEach(v=>addHotspot(board,{...v,title:v.en,label:`Math Vocabulary: ${v.en} / ${v.vi}`,action:'vocab'}));
      addHotspot(board,{x:.64,y:.25,w:.34,h:.28,title:'Practice with Model Sentences',vi:'Luyện theo câu mẫu',action:'sentences',label:'Practice with Model Sentences / Luyện theo câu mẫu'});
      addHotspot(board,{x:.64,y:.535,w:.34,h:.28,title:'Math Dialogue',vi:'Hội thoại Toán học',action:'dialogue',label:'Math Dialogue / Hội thoại Toán học'});
    } else if (currentRoute === 'progress') {
      addHotspot(board,{x:.31,y:.455,w:.24,h:.075,title:'Math Skills',vi:'Kỹ năng Toán học',action:'progress-math',label:'Math Skills / Kỹ năng Toán học'});
      addHotspot(board,{x:.80,y:.455,w:.17,h:.075,title:'English Math',vi:'Tiếng Anh toán học',action:'progress-english',label:'English Math / Tiếng Anh toán học'});
      addHotspot(board,{x:.65,y:.875,w:.27,h:.095,route:'chapter2',label:'Ôn tập ngay / Review now'});
    } else {
      // Add a Back control on Fraction because its supplied illustration has no back button.
      if (currentRoute === 'chapter1') {
        addHotspot(board,{x:.012,y:.117,w:.135,h:.064,route:'topics',className:'back-visible',visibleText:'<span class="back-arrow">‹</span><span>Back to<br>Topics Library</span>',label:'Back to Topics Library / Quay lại thư viện chủ đề'});
      } else {
        addHotspot(board,{x:.009,y:.112,w:.135,h:.062,route:'topics',label:'Back to Topics Library / Quay lại thư viện chủ đề'});
      }
      (lessonData[currentRoute] || []).forEach((l)=>addHotspot(board,{...l,title:l.en,vi:l.vi,action:'lesson',label:`Open lesson: ${l.en} / ${l.vi}`}));
    }
  }

  function runHotspot(spec) {
    if (spec.route) { navigate(spec.route); return; }
    if (spec.game) { openGame(spec); return; }
    if (spec.action === 'vocab') { openVocabulary(spec); return; }
    if (spec.action === 'sentences') { openSentencePractice(); return; }
    if (spec.action === 'dialogue') { openDialogue(); return; }
    if (spec.action === 'progress-math') { openProgressDetail('Math Skills','Kỹ năng Toán học'); return; }
    if (spec.action === 'progress-english') { openProgressDetail('English Math','Tiếng Anh toán học'); return; }
    if (spec.action === 'lesson') { openLesson(spec); return; }
  }

  function openModal({title,subtitle='',kicker='MathLingua AI · Demo',content='',actions=''}) {
    modalReturnFocus = document.activeElement;
    modalRoot.hidden = false;
    modalRoot.innerHTML = `
      <div class="modal-scrim" data-close-modal></div>
      <section class="modal-card" role="dialog" aria-modal="true" aria-label="${escapeAttr(title)}">
        <button type="button" class="modal-close" aria-label="Đóng / Close" data-close-modal>×</button>
        <div class="modal-kicker">${kicker}</div>
        <h2 class="modal-title">${title}</h2>
        ${subtitle ? `<div class="modal-subtitle">${subtitle}</div>` : ''}
        <div class="modal-content">${content}</div>
        <div class="modal-actions">${actions || '<button type="button" class="action-btn primary" data-close-modal>Đóng / Close</button>'}</div>
      </section>`;
    modalRoot.querySelectorAll('[data-close-modal]').forEach(el=>el.addEventListener('click',()=>closeModal()));
    const closeBtn = modalRoot.querySelector('.modal-close'); if (closeBtn) closeBtn.focus();
  }

  function closeModal(restoreFocus = true) {
    if (modalRoot.hidden) return;
    modalRoot.hidden = true;
    modalRoot.innerHTML = '';
    if (restoreFocus && modalReturnFocus && typeof modalReturnFocus.focus === 'function') modalReturnFocus.focus();
  }

  function openLogin() {
    openModal({
      title:'Log in', subtitle:'Đăng nhập MathLingua AI', kicker:'Grade 5 · Student and Teacher',
      content:`<p>Đây là bản demo điều hướng, chưa kết nối xác thực tài khoản thật.</p><p>Chọn vai trò để xem luồng trải nghiệm mẫu:</p><div class="choice-grid"><button class="choice-btn" data-role="student">🎒 Student<br><small>Học sinh</small></button><button class="choice-btn" data-role="teacher">🍎 Teacher<br><small>Giáo viên</small></button></div><div class="answer-feedback" id="role-feedback" aria-live="polite"></div>`,
      actions:'<button type="button" class="action-btn" data-close-modal>Đóng / Close</button>'
    });
    modalRoot.querySelectorAll('[data-role]').forEach(btn=>btn.addEventListener('click',()=>{
      const role=btn.dataset.role;
      const feedback=modalRoot.querySelector('#role-feedback');
      if (feedback) feedback.textContent = role==='student' ? 'Đã chọn luồng học sinh mẫu.' : 'Đã chọn luồng giáo viên mẫu.';
      modalRoot.querySelectorAll('[data-role]').forEach(x=>x.classList.remove('correct'));
      btn.classList.add('correct');
    }));
  }

  function openVocabulary(spec) {
    const wordMap = {
      Geometry:['cube','Hình lập phương','A cube has 6 faces.','Hình lập phương có 6 mặt.'],
      Measurement:['length','Độ dài','Measure the length in centimetres.','Đo độ dài bằng xăng-ti-mét.'],
      'Decimal Numbers':['decimal','Số thập phân','3.5 is greater than 3.2.','3,5 lớn hơn 3,2.'],
      'Mixed Numbers':['mixed number','Hỗn số','One and three quarters.','Một và ba phần tư.'],
      Ratio:['ratio','Tỉ số','The ratio is three to five.','Tỉ số là ba trên năm.'],
      Others:['vertex','Đỉnh','A vertex is a corner of a shape.','Đỉnh là một góc của hình.'],
    };
    const w=wordMap[spec.en]||wordMap.Geometry;
    openModal({title:spec.en,subtitle:spec.vi,kicker:'Math Vocabulary · Từ vựng Toán học',content:`<div class="modal-note"><strong>${w[0]}</strong> — ${w[1]}<br><br><strong>${w[2]}</strong><br>${w[3]}</div><p>Đây là một thẻ từ vựng mẫu. Trong phiên bản hoàn chỉnh, nút nghe sẽ phát âm thanh chuẩn và lưu các từ em đã luyện.</p>`,actions:'<button type="button" class="action-btn primary" data-close-modal>Đã hiểu / Got it</button>'});
  }

  function openSentencePractice() {
    openModal({title:'Practice with Model Sentences',subtitle:'Luyện theo câu mẫu',kicker:'Speak & Pronounce',content:`<div class="modal-note"><strong>Model sentence · Câu mẫu</strong><br><span style="font-size:22px;font-weight:900">This is a cube.</span><br>Đây là hình lập phương.</div><p>1. Listen · Nghe câu mẫu<br>2. Repeat · Nhắc lại câu<br>3. Record · Ghi âm câu nói<br>4. Review · Xem phản hồi và luyện lại</p><p>Trong bản demo, các bước được mô phỏng; ghi âm và chấm phát âm cần được kết nối dịch vụ giọng nói.</p>`,actions:'<button type="button" class="action-btn" data-speak="This is a cube.">🔊 Listen · Nghe mẫu</button><button type="button" class="action-btn primary" data-close-modal>Start · Bắt đầu</button>'});
    const speak=modalRoot.querySelector('[data-speak]'); if(speak) speak.addEventListener('click',()=>speakText(speak.dataset.speak));
  }

  function openDialogue() {
    openModal({title:'Math Dialogue',subtitle:'Hội thoại Toán học',kicker:'English Practice · Luyện tiếng Anh',content:`<div class="modal-note"><strong>MathBuddy:</strong> What shape is this?<br><span>Đây là hình gì?</span><br><br><strong>You:</strong> It’s a pyramid.<br><span>Đây là hình chóp.</span></div><p>Học sinh nghe câu hỏi, chọn hoặc nói câu trả lời rồi nhận gợi ý về từ vựng và mẫu câu.</p>`,actions:'<button type="button" class="action-btn" data-speak="What shape is this?">🔊 Listen · Nghe câu hỏi</button><button type="button" class="action-btn primary" data-close-modal>Start · Bắt đầu</button>'});
    const speak=modalRoot.querySelector('[data-speak]'); if(speak) speak.addEventListener('click',()=>speakText(speak.dataset.speak));
  }

  function openProgressDetail(en,vi) {
    const content = en==='Math Skills'
      ? '<p>Trang hồ sơ sẽ hiển thị mức độ thành thạo theo từng kỹ năng dựa trên các câu trả lời đã được chấm.</p><div class="modal-note">Ví dụ: Reading Decimals / Đọc số thập phân · Comparing Decimals / So sánh số thập phân · Measurement / Đại lượng và đo lường.</div>'
      : '<p>Phần này theo dõi từ vựng, câu mẫu, hoạt động nghe hiểu và luyện nói. Kết quả tiếng Anh được lưu riêng với kết quả Toán.</p><div class="modal-note">Vocabulary / Từ vựng · Model Sentences / Câu mẫu · Speaking Practice / Luyện nói.</div>';
    openModal({title:en,subtitle:vi,kicker:'My Progress · Hồ sơ tiến bộ',content,actions:'<button type="button" class="action-btn primary" data-close-modal>Đóng / Close</button>'});
  }

  function openGame(spec) {
    if (spec.game === 'shapes') {
      openModal({title:spec.title,subtitle:spec.vi,kicker:'Math Lab · Khám phá Toán học',content:`<div class="shape-demo"><div class="cube-scene"><div class="cube3d"><div class="face front"></div><div class="face back"></div><div class="face right"></div><div class="face left"></div><div class="face top"></div><div class="face bottom"></div></div></div><div><strong>Explore a cube · Khám phá hình lập phương</strong><p>Quan sát 6 mặt, 12 cạnh và 8 đỉnh của hình lập phương.</p><p>Đây là mô hình 3D minh họa bằng CSS trong bản demo; phiên bản tương tác đầy đủ có thể hỗ trợ xoay, phóng to và bung hình khai triển.</p></div></div>`,actions:'<button type="button" class="action-btn primary" data-close-modal>Finish · Đóng</button>'});
      return;
    }
    if (spec.game === 'mixed') {
      openQuiz({title:spec.title,subtitle:spec.vi,kicker:'Mixed Number Adventure · Trò chơi mẫu',question:'Which mixed number is equal to 7/4? / Hỗn số nào bằng 7/4?',choices:['1 1/4','1 3/4','2 1/4','3/4'],correct:1,explanation:'7/4 = 4/4 + 3/4 = 1 3/4. / Bảy phần tư bằng một và ba phần tư.'});
      return;
    }
    if (spec.game === 'mystery') {
      openQuiz({title:spec.title,subtitle:spec.vi,kicker:'Math Puzzle · Trò chơi mẫu',question:'What comes next: 2, 4, 8, 16, …? / Số nào tiếp theo?',choices:['20','24','32','30'],correct:2,explanation:'Mỗi số được nhân với 2, nên số tiếp theo là 32.'});
      return;
    }
    if (spec.game === 'dragdrop') {
      openQuiz({title:spec.title,subtitle:spec.vi,kicker:'Drag and Drop · Trò chơi mẫu',question:'Match the word “cube” with its Vietnamese meaning. / Ghép từ “cube” với nghĩa tiếng Việt.',choices:['Hình cầu','Hình lập phương','Hình nón','Hình trụ'],correct:1,explanation:'Cube means hình lập phương. / Cube có nghĩa là hình lập phương.'});
      return;
    }
    if (spec.game === 'candy') {
      openQuiz({title:spec.title,subtitle:spec.vi,kicker:'Math Lab · Trò chơi mẫu',question:'Which number is greater? 0.7 or 0.65? / Số nào lớn hơn?',choices:['0.7','0.65','They are equal / Bằng nhau','Not enough information / Chưa đủ thông tin'],correct:0,explanation:'0.7 = 0.70, and 0.70 > 0.65. / 0,70 lớn hơn 0,65.'});
      return;
    }
    openQuiz({title:spec.title,subtitle:spec.vi,kicker:'Math Lab · Trò chơi mẫu',question:'A cube has how many faces? / Hình lập phương có bao nhiêu mặt?',choices:['4','6','8','12'],correct:1,explanation:'A cube has 6 faces, 12 edges and 8 vertices. / Hình lập phương có 6 mặt, 12 cạnh và 8 đỉnh.'});
  }

  function openLesson(spec) {
    let quiz;
    const str=(spec.en+' '+spec.vi).toLowerCase();
    if (str.includes('mixed') || str.includes('hỗn số') || str.includes('fraction') || str.includes('phân số')) {
      quiz={title:spec.en,subtitle:spec.vi,kicker:'Lesson Preview · Xem trước bài học',question:'Which mixed number is equal to 7/4? / Hỗn số nào bằng 7/4?',choices:['1 1/4','1 3/4','2 1/4','3/4'],correct:1,explanation:'7/4 = 4/4 + 3/4 = 1 3/4. / Bảy phần tư bằng một và ba phần tư.'};
    } else if (str.includes('decimal') || str.includes('thập phân') || str.includes('rounding') || str.includes('operations')) {
      quiz={title:spec.en,subtitle:spec.vi,kicker:'Lesson Preview · Xem trước bài học',question:'Which number is greater? 4.35 or 4.28? / Số nào lớn hơn?',choices:['4.35','4.28','They are equal / Bằng nhau','Cannot compare / Không thể so sánh'],correct:0,explanation:'Both whole parts are 4; in the tenths place, 3 > 2. / Hai phần nguyên bằng 4; chữ số hàng phần mười có 3 > 2.'};
    } else if (str.includes('ratio') || str.includes('tỉ số')) {
      quiz={title:spec.en,subtitle:spec.vi,kicker:'Lesson Preview · Xem trước bài học',question:'There are 3 red balls and 5 blue balls. What is the ratio of red to blue? / Tỉ số bóng đỏ so với bóng xanh là gì?',choices:['3:5','5:3','3:8','8:3'],correct:0,explanation:'There are 3 red balls for every 5 blue balls, so the ratio is 3:5.'};
    } else if (str.includes('area') || str.includes('diện tích') || str.includes('volume') || str.includes('thể tích') || str.includes('surface')) {
      quiz={title:spec.en,subtitle:spec.vi,kicker:'Lesson Preview · Xem trước bài học',question:'A rectangle is 4 cm long and 3 cm wide. What is its area? / Hình chữ nhật dài 4 cm, rộng 3 cm. Diện tích là bao nhiêu?',choices:['7 cm²','12 cm²','14 cm²','12 cm'],correct:1,explanation:'Area = length × width = 4 × 3 = 12 cm². / Diện tích = dài × rộng = 12 cm².'};
    } else {
      quiz={title:spec.en,subtitle:spec.vi,kicker:'Lesson Preview · Xem trước bài học',question:'A cube has how many faces? / Hình lập phương có bao nhiêu mặt?',choices:['4','6','8','12'],correct:1,explanation:'A cube has 6 faces. / Hình lập phương có 6 mặt.'};
    }
    openQuiz(quiz);
  }

  function openQuiz(q) {
    openModal({title:q.title,subtitle:q.subtitle,kicker:q.kicker,content:`<div class="modal-note"><strong>${q.question}</strong></div><div class="choice-grid">${q.choices.map((c,i)=>`<button type="button" class="choice-btn" data-choice="${i}">${c}</button>`).join('')}</div><div id="quiz-feedback" class="answer-feedback" aria-live="polite"></div>`,actions:'<button type="button" class="action-btn" data-close-modal>Close · Đóng</button>'});
    modalRoot.querySelectorAll('[data-choice]').forEach(btn=>btn.addEventListener('click',()=>{
      const idx=Number(btn.dataset.choice);
      modalRoot.querySelectorAll('[data-choice]').forEach(b=>{b.disabled=true; b.classList.remove('correct','incorrect');});
      btn.classList.add(idx===q.correct?'correct':'incorrect');
      const correctBtn=modalRoot.querySelector(`[data-choice="${q.correct}"]`); if(correctBtn)correctBtn.classList.add('correct');
      const feedback=modalRoot.querySelector('#quiz-feedback');
      if(feedback) feedback.innerHTML=`${idx===q.correct?'✅ Correct! · Chính xác!':'💡 Not quite. · Chưa chính xác.'}<div class="modal-note">${q.explanation}</div>`;
    }));
  }

  function speakText(text) {
    if ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) {
      try { const u = new SpeechSynthesisUtterance(text); u.lang='en-US'; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); }
      catch { /* The browser may block speech; the demo remains usable. */ }
    } else {
      const fb=modalRoot.querySelector('.modal-content');
      if(fb) fb.insertAdjacentHTML('beforeend','<p class="modal-note">Phát âm thanh chưa được hỗ trợ trong trình duyệt này. / Audio is not supported in this browser.</p>');
    }
  }

  function escapeAttr(value) { return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }

  document.addEventListener('keydown',e=>{ if(e.key==='Escape')closeModal(); });
  window.addEventListener('popstate',()=>navigate(currentHashRoute(),false));
  window.addEventListener('hashchange',()=>{
    const route=currentHashRoute();
    if(route!==currentRoute) navigate(route,false);
  });

  // Initialize from URL so page links and browser history work in the prototype.
  currentRoute = currentHashRoute();
  renderNav();
  renderPage();
  if (!location.hash) history.replaceState({route:'home'}, '', '#home');
})();
