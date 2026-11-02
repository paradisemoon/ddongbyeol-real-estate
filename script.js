"use strict";

// 다른 페이지 파일을 바꾸지 않고 공통 메뉴에 상품·서비스를 연결합니다.
const menuList = document.querySelector(".menu-list");
if (menuList && !menuList.querySelector('a[href="services.html"]')) {
  const servicesItem = document.createElement("li");
  const servicesLink = document.createElement("a");
  servicesLink.href = "services.html";
  servicesLink.textContent = "상품·서비스";
  servicesItem.append(servicesLink);
  const aboutLink = menuList.querySelector('a[href="about.html"]');
  menuList.insertBefore(servicesItem, aboutLink ? aboutLink.closest("li") : null);
}

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");

function closeMenu() {
  navigation.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "메뉴 열기");
}

menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("is-open")) {
    closeMenu();
    menuButton.focus();
  }
});

window.matchMedia("(min-width: 1101px)").addEventListener("change", closeMenu);

document.querySelectorAll("[data-dialog]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById(link.dataset.dialog).showModal();
  });
});

const inquiryForm = document.getElementById("home-inquiry-form");
if (inquiryForm) {
  const inquiryStatus = document.getElementById("home-inquiry-status");
  inquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    inquiryStatus.textContent = "접수되었습니다(예시)";
    inquiryForm.reset();
  });
  inquiryForm.addEventListener("input", () => {
    inquiryStatus.textContent = "";
  });
  document.getElementById("home-inquiry-submit").disabled = false;
}

const servicesForm = document.getElementById("services-inquiry-form");
if (servicesForm) {
  const servicesStatus = document.getElementById("services-inquiry-status");
  servicesForm.addEventListener("submit", (event) => {
    event.preventDefault();
    servicesStatus.textContent = "접수되었습니다(예시)";
    servicesForm.reset();
  });
  servicesForm.addEventListener("input", () => {
    servicesStatus.textContent = "";
  });
  document.getElementById("services-inquiry-submit").disabled = false;
}

// 매물 검색, 상세 보기, 관심 저장: 모두 예시 자료입니다.
const propertyData = [
 {id:'a1',category:'아파트',title:'34평 아파트',price:23500,display:'2억 3,500만원',trade:'매매',area:'34평',location:'예시시 별빛동',feature:'로얄층 남향',theme:'역',note:'로얄층(선호하는 층), 남향의 예시 아파트입니다.'},
 {id:'a2',category:'아파트',title:'햇살 담은 아파트',price:18000,display:'1억 8,000만원',trade:'전세',area:'25평',location:'예시시 햇살동',feature:'편의시설 가까운 곳',theme:'상권',note:'가게와 생활 편의시설 가까이에 있는 예시 아파트입니다.'},
 {id:'r1',category:'원룸·투룸',title:'새롭게 고친 투룸',price:8500,display:'8,500만원',trade:'전세',area:'15평',location:'예시시 별빛동',feature:'집 안 전체 수리',theme:'역',note:'방 두 개와 주방을 갖춘 예시 공간입니다.'},
 {id:'r2',category:'원룸·투룸',title:'가볍게 시작하는 원룸',price:500,display:'보증금 500만원 · 월 40만원',trade:'월세',area:'8평',location:'예시시 햇살동',feature:'가게 가까운 곳',theme:'상권',note:'방 한 개의 예시 공간입니다. 월세 정렬은 보증금 기준입니다.'},
 {id:'h1',category:'주택',title:'작은 마당이 있는 주택',price:27000,display:'2억 7,000만원',trade:'매매',area:'30평',location:'예시시 별빛동',feature:'마당과 남향 거실',theme:'역',note:'마당을 갖춘 예시 주택입니다.'},
 {id:'h2',category:'주택',title:'차분한 동네의 주택',price:12000,display:'1억 2,000만원',trade:'전세',area:'24평',location:'예시시 햇살동',feature:'편의시설 가까운 곳',theme:'상권',note:'생활 편의시설 가까이에 있는 예시 주택입니다.'},
 {id:'s1',category:'상가',title:'주차가 편리한 상가',price:12000,display:'1억 2,000만원',trade:'매매',area:'20평',location:'예시시 별빛동',feature:'유동인구 많고 주차편리',theme:'상권',note:'지나다니는 사람이 많고 주차가 편리하다는 조건의 예시 상가입니다.'},
 {id:'s2',category:'상가',title:'역 가까운 작은 상가',price:1000,display:'보증금 1,000만원 · 월 80만원',trade:'월세',area:'12평',location:'예시시 햇살동',feature:'역 가까운 곳',theme:'역',note:'작은 가게를 위한 예시 공간입니다. 월세 정렬은 보증금 기준입니다.'}
];
let savedProperties = new Set();
try { const value = JSON.parse(localStorage.getItem('ddongbyeol-saved') || '[]'); if (Array.isArray(value)) savedProperties = new Set(value.filter(id => propertyData.some(p => p.id === id))); } catch (_) {}
function filterProperties(data, options) {
 const q = (options.q || '').trim().toLocaleLowerCase();
 const results = data.filter(p => (!options.category || options.category === '전체' || p.category === options.category) && (!options.trade || p.trade === options.trade) && (!options.theme || p.theme === options.theme) && (!options.saved || savedProperties.has(p.id)) && (!q || [p.title,p.location,p.feature,p.category].join(' ').toLocaleLowerCase().includes(q)));
 if (options.sort === 'low') results.sort((a,b) => a.price-b.price);
 if (options.sort === 'high') results.sort((a,b) => b.price-a.price);
 return results;
}
const catalogue = document.querySelector('.catalogue');
function renderCatalogue() {
 if (!catalogue) return;
 const f = catalogue.querySelector('form');
 const results = filterProperties(propertyData, {category:catalogue.dataset.category,q:f.elements.q.value,trade:f.elements.trade.value,theme:f.elements.theme.value,sort:f.elements.sort.value,saved:f.elements.saved.checked});
 catalogue.querySelector('.catalogue-count').textContent = '예시 매물 ' + results.length + '개 · 가격은 월세의 경우 보증금 기준입니다.';
 catalogue.querySelector('.catalogue-results').innerHTML = results.length ? results.map(p => `<article class="home-card listing-card"><div class="photo-placeholder">여기에 ${p.category} 사진 · 예시</div><div class="home-card-body"><p class="listing-tag">${p.category} · ${p.trade} · 예시</p><h3>${p.title}</h3><p class="home-price">${p.display}</p><p>${p.location} · ${p.area}</p><p>${p.feature}</p><div class="listing-actions"><button class="button" data-property="${p.id}">상세 보기</button><button class="plain-button" data-save="${p.id}" aria-pressed="${savedProperties.has(p.id)}">${savedProperties.has(p.id)?'관심 저장됨':'관심 저장'}</button></div></div></article>`).join('') : '<div class="empty-results"><h3>조건에 맞는 예시 매물이 없습니다.</h3><p>검색어를 줄이거나 조건 초기화를 눌러 주세요.</p></div>';
}
if (catalogue) {
 const filters = catalogue.querySelector('form');
 filters.addEventListener('submit', event => event.preventDefault());
 filters.addEventListener('input', renderCatalogue);
 filters.addEventListener('change', renderCatalogue);
 filters.addEventListener('reset', () => setTimeout(renderCatalogue,0));
 renderCatalogue();
}
document.addEventListener('click', event => {
 const save = event.target.closest('[data-save]');
 if (save) { const id = save.dataset.save; if(savedProperties.has(id)) savedProperties.delete(id); else savedProperties.add(id); try {localStorage.setItem('ddongbyeol-saved',JSON.stringify([...savedProperties]));} catch (_) {} renderCatalogue(); }
 const button = event.target.closest('[data-property]');
 if (button) {
  const p = propertyData.find(item=>item.id===button.dataset.property); if (!p) return;
  document.getElementById('property-detail').innerHTML = `<p class="listing-tag">${p.category} · ${p.trade} · 예시 자료</p><h2 id="property-title">${p.title}</h2><div class="photo-placeholder">여기에 ${p.title} 내부 사진 · 예시</div><p class="home-price">${p.display}</p><p>${p.location} · ${p.area}</p><p>${p.note}</p><p>상품과 가격은 모두 가짜 예시이며 실제 거래할 수 없습니다.</p><a class="button" href="contact.html?property=${p.id}">이 매물 문의하기</a>`;
  document.getElementById('property-dialog').showModal();
 }
});
document.querySelectorAll('[data-demo-form]').forEach(form => {
 const status = form.querySelector('[role="status"]');
 form.addEventListener('submit', event => {event.preventDefault(); if (!form.reportValidity()) return; status.textContent='접수되었습니다(예시)'; form.reset();});
 form.addEventListener('input',()=>status.textContent='');
 form.querySelector('button[type="submit"]').disabled=false;
 const subject = propertyData.find(p=>p.id===new URLSearchParams(location.search).get('property'));
 if(subject) { const field=form.querySelector('textarea');field.defaultValue=subject.title+' ('+subject.trade+' '+subject.display+') 문의드립니다.';field.value=field.defaultValue; }
});
document.querySelectorAll('[data-review-filter]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-review-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 document.querySelectorAll('[data-review]').forEach(review=>review.hidden=button.dataset.reviewFilter!=='전체'&&review.dataset.review!==button.dataset.reviewFilter);
}));