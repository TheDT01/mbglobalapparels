/* ==========================================================================
   MB GLOBAL APPARELS — main.js
   ========================================================================== */
(function(){
  "use strict";

  /* ---------- preloader ---------- */
  (function(){
    var hidden = false;
    function hidePreloader(){
      if(hidden) return;
      hidden = true;
      var pre = document.getElementById("preloader");
      if(pre){ pre.classList.add("is-hidden"); }
      document.body.classList.add("page-ready");
    }
    window.addEventListener("load", function(){ setTimeout(hidePreloader, 300); });
    // Hard fallback in case the load event is delayed or never fires
    // (slow/blocked external font request, etc.) — never leave the
    // preloader covering the page indefinitely.
    setTimeout(hidePreloader, 1800);
  })();

  /* ---------- theme toggle ---------- */
  var THEME_KEY = "mbga-theme";
  function applyTheme(t){
    if(t === "dark"){ document.documentElement.setAttribute("data-theme","dark"); }
    else{ document.documentElement.removeAttribute("data-theme"); }
  }
  var savedTheme = null;
  try{ savedTheme = localStorage.getItem(THEME_KEY); }catch(e){}
  if(savedTheme){ applyTheme(savedTheme); }
  else if(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches){
    applyTheme("dark");
  }
  document.addEventListener("DOMContentLoaded", function(){
    var toggle = document.getElementById("themeToggle");
    if(toggle){
      toggle.addEventListener("click", function(){
        var isDark = document.documentElement.getAttribute("data-theme") === "dark";
        var next = isDark ? "light" : "dark";
        applyTheme(next);
        try{ localStorage.setItem(THEME_KEY, next); }catch(e){}
      });
    }
  });

  /* ---------- sticky header ---------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader(){
    if(!header) return;
    if(window.scrollY > 40){ header.classList.add("is-scrolled"); }
    else{ header.classList.remove("is-scrolled"); }
  }
  document.addEventListener("scroll", onScrollHeader, { passive:true });
  onScrollHeader();

  /* ---------- mobile nav ---------- */
  document.addEventListener("DOMContentLoaded", function(){
    var navToggle = document.getElementById("navToggle");
    var mainNav = document.getElementById("mainNav");
    if(navToggle && mainNav){
      navToggle.addEventListener("click", function(){
        navToggle.classList.toggle("is-active");
        mainNav.classList.toggle("is-open");
        document.body.style.overflow = mainNav.classList.contains("is-open") ? "hidden" : "";
      });
      mainNav.querySelectorAll("a").forEach(function(a){
        a.addEventListener("click", function(){
          navToggle.classList.remove("is-active");
          mainNav.classList.remove("is-open");
          document.body.style.overflow = "";
        });
      });
    }
  });

  /* ---------- back to top ---------- */
  document.addEventListener("DOMContentLoaded", function(){
    var btt = document.getElementById("backToTop");
    if(!btt) return;
    window.addEventListener("scroll", function(){
      if(window.scrollY > 600){ btt.classList.add("is-shown"); }
      else{ btt.classList.remove("is-shown"); }
    }, { passive:true });
    btt.addEventListener("click", function(){
      window.scrollTo({ top:0, behavior:"smooth" });
    });
  });

  /* ---------- scroll reveal ---------- */
  document.addEventListener("DOMContentLoaded", function(){
    var items = document.querySelectorAll(".reveal, .reveal-scale, .process-step");

    if(!("IntersectionObserver" in window)){
      items.forEach(function(el){ el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.15, rootMargin:"0px 0px -60px 0px" });
    items.forEach(function(el){ io.observe(el); });

    // Safety net: if anything is somehow never observed as intersecting
    // (edge cases, extremely tall sections, etc.) force it visible so
    // text can never be stuck invisible.
    setTimeout(function(){
      items.forEach(function(el){ el.classList.add("is-visible"); });
    }, 2500);

    // process line fill
    var line = document.querySelector(".process-line-fill");
    var processEl = document.querySelector(".process");
    if(line && processEl){
      var steps = processEl.querySelectorAll(".process-step");
      var lineIO = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            var idx = Array.prototype.indexOf.call(steps, entry.target);
            var pct = ((idx + 1) / steps.length) * 100;
            line.style.height = pct + "%";
          }
        });
      }, { threshold:0.5 });
      steps.forEach(function(s){ lineIO.observe(s); });
    }

    // bar chart fill
    var bars = document.querySelectorAll(".bar-fill");
    if(bars.length){
      var barIO = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            var target = entry.target.getAttribute("data-value") || "0";
            entry.target.style.width = target + "%";
            barIO.unobserve(entry.target);
          }
        });
      }, { threshold:0.4 });
      bars.forEach(function(b){ barIO.observe(b); });
    }
  });

  /* ---------- animated counters ---------- */
  document.addEventListener("DOMContentLoaded", function(){
    var counters = document.querySelectorAll("[data-count]");
    if(!counters.length) return;
    function animateCount(el){
      var target = parseFloat(el.getAttribute("data-count"));
      var decimals = (el.getAttribute("data-count").split(".")[1] || "").length;
      var duration = 1600;
      var start = null;
      function step(ts){
        if(!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var val = target * eased;
        el.textContent = val.toFixed(decimals);
        if(progress < 1){ requestAnimationFrame(step); }
        else{ el.textContent = target.toFixed(decimals); }
      }
      requestAnimationFrame(step);
    }
    var cIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          animateCount(entry.target);
          cIO.unobserve(entry.target);
        }
      });
    }, { threshold:0.5 });
    counters.forEach(function(c){ cIO.observe(c); });
  });

  /* ---------- testimonial slider ---------- */
  document.addEventListener("DOMContentLoaded", function(){
    var slider = document.querySelector(".testimonial-slider");
    if(!slider) return;
    var slides = slider.querySelectorAll(".testimonial-slide");
    var dotsWrap = slider.querySelector(".slider-dots");
    var current = 0;
    var timer;

    slides.forEach(function(_, i){
      var dot = document.createElement("button");
      if(i === 0) dot.classList.add("is-active");
      dot.setAttribute("aria-label", "Go to testimonial " + (i+1));
      dot.addEventListener("click", function(){ goTo(i); resetTimer(); });
      dotsWrap.appendChild(dot);
    });

    function goTo(i){
      slides[current].classList.remove("is-active");
      dotsWrap.children[current].classList.remove("is-active");
      current = i;
      slides[current].classList.add("is-active");
      dotsWrap.children[current].classList.add("is-active");
    }
    function next(){ goTo((current + 1) % slides.length); }
    function resetTimer(){ clearInterval(timer); timer = setInterval(next, 6000); }
    resetTimer();
  });

  /* ---------- accordion (FAQ) ---------- */
  document.addEventListener("DOMContentLoaded", function(){
    var items = document.querySelectorAll(".accordion-item");
    items.forEach(function(item){
      var head = item.querySelector(".accordion-head");
      var body = item.querySelector(".accordion-body");
      head.addEventListener("click", function(){
        var isOpen = item.classList.contains("is-open");
        items.forEach(function(other){
          other.classList.remove("is-open");
          other.querySelector(".accordion-body").style.maxHeight = null;
        });
        if(!isOpen){
          item.classList.add("is-open");
          body.style.maxHeight = body.scrollHeight + "px";
        }
      });
    });
  });

  /* ---------- product filter tabs ---------- */
  document.addEventListener("DOMContentLoaded", function(){
    var tabs = document.querySelectorAll(".tab-btn");
    if(!tabs.length) return;
    var cards = document.querySelectorAll(".product-card");
    tabs.forEach(function(tab){
      tab.addEventListener("click", function(){
        tabs.forEach(function(t){ t.classList.remove("is-active"); });
        tab.classList.add("is-active");
        var filter = tab.getAttribute("data-filter");
        cards.forEach(function(card){
          var cat = card.getAttribute("data-category");
          var show = (filter === "all" || filter === cat);
          card.classList.toggle("is-shown", show);
        });
      });
    });
  });

  /* ---------- lead-time / MOQ estimator ---------- */
  document.addEventListener("DOMContentLoaded", function(){
    var estimator = document.getElementById("estimator");
    if(!estimator) return;
    var categorySelect = document.getElementById("estCategory");
    var qtyRange = document.getElementById("estQty");
    var qtyValue = document.getElementById("estQtyValue");
    var resSampling = document.getElementById("resSampling");
    var resProduction = document.getElementById("resProduction");
    var resMoq = document.getElementById("resMoq");
    var resTotal = document.getElementById("resTotal");

    var baseData = {
      "knit-basic":   { sampling:12, perThousand:2.2, moq:500,  label:"Knit Basics (Tees/Polos)" },
      "knit-fleece":  { sampling:15, perThousand:2.8, moq:800,  label:"Fleece & Hoodies" },
      "woven-shirt":  { sampling:18, perThousand:3.4, moq:1000, label:"Woven Shirts" },
      "woven-bottom": { sampling:16, perThousand:3.0, moq:1000, label:"Trousers & Bottoms" },
      "outerwear":    { sampling:22, perThousand:4.2, moq:1200, label:"Jackets & Outerwear" }
    };

    function formatQty(v){
      v = parseInt(v, 10);
      return v.toLocaleString() + " units";
    }

    function update(){
      var cat = baseData[categorySelect.value];
      var qty = parseInt(qtyRange.value, 10);
      qtyValue.textContent = formatQty(qty);
      var productionDays = Math.round((qty / 1000) * cat.perThousand * 7);
      productionDays = Math.max(productionDays, 18);
      var samplingDays = cat.sampling;
      var totalDays = samplingDays + productionDays + 10; // + shipping buffer
      resSampling.innerHTML = samplingDays + '<span class="unit">days</span>';
      resProduction.innerHTML = productionDays + '<span class="unit">days</span>';
      resMoq.innerHTML = cat.moq.toLocaleString() + '<span class="unit">units</span>';
      resTotal.innerHTML = totalDays + '<span class="unit">days total</span>';
    }

    categorySelect.addEventListener("change", update);
    qtyRange.addEventListener("input", update);
    update();
  });

  /* ---------- contact form ---------- */
  document.addEventListener("DOMContentLoaded", function(){
    var form = document.getElementById("contactForm");
    if(!form) return;
    var success = document.getElementById("formSuccess");

    form.addEventListener("submit", function(e){
      e.preventDefault();
      var required = form.querySelectorAll("[required]");
      var valid = true;
      required.forEach(function(field){
        if(!field.value.trim()){
          valid = false;
          field.style.borderColor = "#e5484d";
        } else {
          field.style.borderColor = "";
        }
      });
      if(!valid) return;

      form.style.display = "none";
      success.classList.add("is-shown");
    });

    form.querySelectorAll("input,textarea,select").forEach(function(field){
      field.addEventListener("input", function(){ field.style.borderColor = ""; });
    });
  });

  /* ---------- custom cursor ---------- */
  document.addEventListener("DOMContentLoaded", function(){
    if(!window.matchMedia || !window.matchMedia("(pointer:fine)").matches) return;
    var dot = document.createElement("div");
    dot.className = "cursor-dot";
    var ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mx=0, my=0, rx=0, ry=0;
    document.addEventListener("mousemove", function(e){
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
    });
    function loop(){
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    }
    loop();

    document.querySelectorAll("a,button,.card,.tab-btn,input,textarea,select").forEach(function(el){
      el.addEventListener("mouseenter", function(){ ring.classList.add("is-active"); });
      el.addEventListener("mouseleave", function(){ ring.classList.remove("is-active"); });
    });
  });

  /* ---------- active nav link by current page ---------- */
  document.addEventListener("DOMContentLoaded", function(){
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".main-nav a").forEach(function(a){
      var href = a.getAttribute("href");
      if(href === path || (path === "" && href === "index.html")){
        a.classList.add("active");
      }
    });
  });



  /* ---------- gallery lightbox ---------- */
  document.addEventListener("DOMContentLoaded", function(){
    var lightbox = document.getElementById("lightbox");
    if(!lightbox) return;
    var lbLabel = document.getElementById("lightboxLabel");
    var lbCaption = document.getElementById("lightboxCaption");
    var closeBtn = lightbox.querySelector(".lightbox-close");

    document.querySelectorAll(".gallery-item").forEach(function(item){
      item.addEventListener("click", function(){
        var label = item.getAttribute("data-label") || "Gallery Image";
        var caption = item.getAttribute("data-caption") || "";
        lbLabel.textContent = label;
        lbCaption.textContent = caption;
        lightbox.classList.add("is-open");
        document.body.style.overflow = "hidden";
      });
    });

    function closeLightbox(){
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    }
    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function(e){
      if(e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape") closeLightbox();
    });
  });

})();
