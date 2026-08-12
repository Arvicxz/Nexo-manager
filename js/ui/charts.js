/* =====================================================================
   charts.js — Biblioteca mínima de gráficos em SVG, sem dependências.
   Cada função devolve uma string SVG pronta para ser inserida no HTML.
   Cores sempre por variável CSS, para preservar o significado semântico.
   ===================================================================== */
window.CH = (function () {

  var C = {
    blue:'var(--c-blue)', green:'var(--c-green)', amber:'var(--c-amber)',
    red:'var(--c-red)', purple:'var(--c-purple)', gray:'var(--c-gray)',
    ink:'var(--ink)', ink3:'var(--ink-3)', line:'var(--line)', surface:'var(--surface)'
  };
  function col(c){ return C[c] || c || C.blue; }
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function n1(v){ return (Math.round(v*10)/10).toString().replace('.',','); }
  function n0(v){ return Math.round(v).toLocaleString('pt-BR'); }
  function niceMax(v){
    if(v<=0) return 1;
    var e = Math.pow(10, Math.floor(Math.log10(v)));
    var f = v/e, m = f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10;
    return m*e;
  }
  function svg(w,h,inner,label,cls){
    return '<svg class="chart'+(cls?' '+cls:'')+'" width="'+w+'" height="'+h+'" '+
           'style="aspect-ratio:'+w+'/'+h+'" '+
           'viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="xMidYMid meet" '+
           'role="img" aria-label="'+esc(label||'Gráfico')+'">'+inner+'</svg>';
  }
  function tip(t){ return '<title>'+esc(t)+'</title>'; }

  /* eixos horizontais com rótulos à esquerda */
  function frameY(p, min, max, fmt, ticks){
    ticks = ticks || 4; var out=''; 
    for (var i=0;i<=ticks;i++){
      var v = min + (max-min)*i/ticks;
      var y = p.t + p.ih - (v-min)/(max-min)*p.ih;
      out += '<line class="c-grid" x1="'+p.l+'" y1="'+y.toFixed(1)+'" x2="'+(p.l+p.iw)+'" y2="'+y.toFixed(1)+'"/>'+
             '<text class="c-lbl" x="'+(p.l-8)+'" y="'+(y+4).toFixed(1)+'" text-anchor="end">'+esc(fmt(v))+'</text>';
    }
    return out;
  }
  function frameX(p, labels, everyN){
    var out='', n=labels.length, step = everyN || 1;
    for (var i=0;i<n;i++){
      if (i % step) continue;
      var x = n===1 ? p.l+p.iw/2 : p.l + i*(p.iw/(n-1));
      out += '<text class="c-lbl" x="'+x.toFixed(1)+'" y="'+(p.t+p.ih+18)+'" text-anchor="middle">'+esc(labels[i])+'</text>';
    }
    return out;
  }
  function pad(w,h,o){
    var l=(o&&o.l)||54, r=(o&&o.r)||18, t=(o&&o.t)||16, b=(o&&o.b)||30;
    return { l:l, r:r, t:t, b:b, iw:w-l-r, ih:h-t-b, w:w, h:h };
  }

  var API = {};

  /* --------------------------------------------------- linha */
  API.line = function (cfg){
    var w=cfg.w||720, h=cfg.h||250, p=pad(w,h,cfg.pad), s=cfg.series, all=[];
    s.forEach(function(se){ all = all.concat(se.values.filter(function(v){ return v!=null; })); });
    if (cfg.target != null) all.push(cfg.target);
    var max = cfg.max != null ? cfg.max : niceMax(Math.max.apply(null,all)*1.05);
    var min = cfg.min != null ? cfg.min : (Math.min.apply(null,all) >= 0 ? 0 : Math.min.apply(null,all)*1.1);
    var fmt = cfg.fmt || n0;
    var X = function(i){ return p.l + i*(p.iw/(cfg.labels.length-1)); };
    var Y = function(v){ return p.t + p.ih - (v-min)/(max-min)*p.ih; };
    var g = frameY(p,min,max,fmt,cfg.ticks) + frameX(p,cfg.labels,cfg.everyN);

    if (cfg.target != null){
      g += '<line class="c-target" x1="'+p.l+'" y1="'+Y(cfg.target).toFixed(1)+'" x2="'+(p.l+p.iw)+'" y2="'+Y(cfg.target).toFixed(1)+'"/>'+
           '<text class="c-lbl" x="'+(p.l+p.iw)+'" y="'+(Y(cfg.target)-6).toFixed(1)+'" text-anchor="end">'+esc(cfg.targetLabel||('Meta '+fmt(cfg.target)))+'</text>';
    }
    s.forEach(function(se){
      var c = col(se.color), d='', pen=false;
      se.values.forEach(function(v,i){
        if (v==null){ pen=false; return; }
        d += (pen?'L':'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1) + ' '; pen=true;
      });
      if (se.area){
        g += '<path d="'+d+'L'+X(se.values.length-1).toFixed(1)+' '+(p.t+p.ih)+' L'+p.l+' '+(p.t+p.ih)+' Z" fill="'+c+'" opacity=".10"/>';
      }
      g += '<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"'+
           (se.dash?' stroke-dasharray="5 4"':'')+'/>';
      se.values.forEach(function(v,i){
        if (v==null) return;
        g += '<circle class="hit" cx="'+X(i).toFixed(1)+'" cy="'+Y(v).toFixed(1)+'" r="3.5" fill="var(--surface)" stroke="'+c+'" stroke-width="2">'+
             tip(se.name+' · '+cfg.labels[i]+': '+fmt(v))+'</circle>';
      });
    });
    g += '<line class="c-axis" x1="'+p.l+'" y1="'+(p.t+p.ih)+'" x2="'+(p.l+p.iw)+'" y2="'+(p.t+p.ih)+'"/>';
    return svg(w,h,g,cfg.label);
  };

  /* --------------------------------------------------- área acumulada */
  API.area = function (cfg){
    cfg.series = cfg.series.map(function(s){ s.area = true; return s; });
    return API.line(cfg);
  };

  /* --------------------------------------------------- barras */
  API.bars = function (cfg){
    var w=cfg.w||720, h=cfg.h||250, horiz=!!cfg.horizontal;
    var p=pad(w,h,cfg.pad || (horiz?{l:104,b:26}:null));
    var s=cfg.series, n=cfg.labels.length, stack=cfg.mode==='stack';
    var tot=[], i, j;
    for(i=0;i<n;i++){ var t=0; s.forEach(function(se){ t += stack ? se.values[i] : 0; }); tot.push(t); }
    var all=[]; s.forEach(function(se){ all=all.concat(se.values); });
    var maxv = stack ? Math.max.apply(null,tot) : Math.max.apply(null,all);
    if (cfg.target!=null) maxv = Math.max(maxv, cfg.target);
    var max = cfg.max!=null ? cfg.max : niceMax(maxv*1.08);
    var fmt = cfg.fmt || n0, g='';

    if (horiz){
      var bh = p.ih/n, inner = bh*0.62, gap=(bh-inner)/2;
      g += '<line class="c-axis" x1="'+p.l+'" y1="'+p.t+'" x2="'+p.l+'" y2="'+(p.t+p.ih)+'"/>';
      for (i=0;i<=4;i++){
        var vx=max*i/4, x=p.l+vx/max*p.iw;
        g += '<line class="c-grid" x1="'+x.toFixed(1)+'" y1="'+p.t+'" x2="'+x.toFixed(1)+'" y2="'+(p.t+p.ih)+'"/>'+
             '<text class="c-lbl" x="'+x.toFixed(1)+'" y="'+(p.t+p.ih+16)+'" text-anchor="middle">'+esc(fmt(vx))+'</text>';
      }
      for (i=0;i<n;i++){
        var y0=p.t+i*bh+gap, val=s[0].values[i], bw=val/max*p.iw;
        var c = s[0].colors ? col(s[0].colors[i]) : col(s[0].color);
        g += '<text class="c-lbl" x="'+(p.l-8)+'" y="'+(y0+inner/2+4).toFixed(1)+'" text-anchor="end">'+esc(cfg.labels[i])+'</text>'+
             '<rect class="hit" x="'+p.l+'" y="'+y0.toFixed(1)+'" width="'+Math.max(bw,1).toFixed(1)+'" height="'+inner.toFixed(1)+'" rx="2" fill="'+c+'">'+
             tip(cfg.labels[i]+': '+fmt(val))+'</rect>'+
             '<text class="c-val" x="'+(p.l+bw+6).toFixed(1)+'" y="'+(y0+inner/2+4).toFixed(1)+'">'+esc(fmt(val))+'</text>';
      }
      return svg(w,h,g,cfg.label);
    }

    var Y=function(v){ return p.t+p.ih - v/max*p.ih; };
    g += frameY(p,0,max,fmt,4);
    var bw2 = p.iw/n, group = bw2*0.66, each = stack ? group : group/s.length;
    for (i=0;i<n;i++){
      var xg = p.l + i*bw2 + (bw2-group)/2, acc=0;
      for (j=0;j<s.length;j++){
        var v=s[j].values[i], c2=col(s[j].color), x, y, hh;
        if (stack){ x=xg; hh=v/max*p.ih; y=Y(acc+v); acc+=v; }
        else { x=xg+j*each; hh=v/max*p.ih; y=Y(v); }
        g += '<rect class="hit" x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+(each-2).toFixed(1)+'" height="'+Math.max(hh,1).toFixed(1)+'" rx="2" fill="'+c2+'"'+
             (s[j].light?' opacity=".45"':'')+(cfg.ids?' data-id="'+esc(cfg.ids[i])+'"':'')+'>'+
             tip(s[j].name+' · '+cfg.labels[i]+': '+fmt(v))+'</rect>';
      }
      g += '<text class="c-lbl" x="'+(p.l+i*bw2+bw2/2).toFixed(1)+'" y="'+(p.t+p.ih+18)+'" text-anchor="middle">'+esc(cfg.labels[i])+'</text>';
    }
    if (cfg.target!=null){
      g += '<line class="c-target" x1="'+p.l+'" y1="'+Y(cfg.target).toFixed(1)+'" x2="'+(p.l+p.iw)+'" y2="'+Y(cfg.target).toFixed(1)+'"/>';
    }
    g += '<line class="c-axis" x1="'+p.l+'" y1="'+(p.t+p.ih)+'" x2="'+(p.l+p.iw)+'" y2="'+(p.t+p.ih)+'"/>';
    return svg(w,h,g,cfg.label);
  };

  /* --------------------------------------------------- cascata
     Tipos de parcela:
       inicio · ponto de partida, barra desde o zero
       neg    · parcela que subtrai, empilhada sobre o acumulado
       sub    · subtotal intermediário, barra desde o zero (ex.: margem bruta)
       fim    · resultado final, barra desde o zero                          */
  API.waterfall = function (cfg){
    var w=cfg.w||720, h=cfg.h||270, p=pad(w,h,{l:60,b:40}), it=cfg.items;
    var acc=0, tops=[], max=0;
    it.forEach(function(x){
      if (x.tipo==='inicio'||x.tipo==='fim'||x.tipo==='sub'){ tops.push({a:0,b:x.v}); acc=x.v; }
      else { tops.push({a:acc, b:acc+x.v}); acc+=x.v; }
      max=Math.max(max, Math.abs(acc), Math.abs(x.v));
    });
    max = niceMax(max*1.1);
    var Y=function(v){ return p.t+p.ih - v/max*p.ih; }, bw=p.iw/it.length, g=frameY(p,0,max,cfg.fmt||n0,4);
    it.forEach(function(x,i){
      var t=tops[i], y0=Y(Math.max(t.a,t.b)), y1=Y(Math.min(t.a,t.b));
      var c = x.tipo==='neg' ? C.red : (x.tipo==='fim' ? C.green : C.blue);
      var xx = p.l+i*bw+bw*0.2;
      g += '<rect class="hit" x="'+xx.toFixed(1)+'" y="'+y0.toFixed(1)+'" width="'+(bw*0.6).toFixed(1)+'" height="'+Math.max(y1-y0,1).toFixed(1)+'" rx="2" fill="'+c+'">'+
           tip(x.rot+': '+(cfg.fmt||n0)(x.v))+'</rect>'+
           '<text class="c-lbl" x="'+(p.l+i*bw+bw/2).toFixed(1)+'" y="'+(p.t+p.ih+18)+'" text-anchor="middle">'+esc(x.rot)+'</text>'+
           '<text class="c-val" x="'+(p.l+i*bw+bw/2).toFixed(1)+'" y="'+(y0-6).toFixed(1)+'" text-anchor="middle">'+esc((cfg.fmt||n0)(x.v))+'</text>';
      if (i<it.length-1){
        var yc = Y(tops[i].b);
        g += '<line x1="'+(xx+bw*0.6).toFixed(1)+'" y1="'+yc.toFixed(1)+'" x2="'+(p.l+(i+1)*bw+bw*0.2).toFixed(1)+'" y2="'+yc.toFixed(1)+'" stroke="'+C.line+'" stroke-dasharray="3 3"/>';
      }
    });
    return svg(w,h,g,cfg.label);
  };

  /* --------------------------------------------------- heatmap */
  API.heatmap = function (cfg){
    var cols=cfg.cols, rows=cfg.rows, cw=cfg.cw||64, rh=cfg.rh||34, lw=cfg.lw||78;
    var w=lw+cols.length*cw+8, h=26+rows.length*rh+6, g='';
    cols.forEach(function(c,i){
      g += '<text class="c-lbl" x="'+(lw+i*cw+cw/2)+'" y="16" text-anchor="middle">'+esc(c)+'</text>';
    });
    rows.forEach(function(r,j){
      var y=26+j*rh;
      g += '<text class="c-lbl" x="'+(lw-10)+'" y="'+(y+rh/2+4)+'" text-anchor="end">'+esc(r.label)+'</text>';
      r.v.forEach(function(v,i){
        var st=cfg.color(v), x=lw+i*cw;
        g += '<rect class="hit" x="'+(x+2)+'" y="'+(y+2)+'" width="'+(cw-4)+'" height="'+(rh-4)+'" rx="3" fill="'+st.fill+'" stroke="'+(st.stroke||'transparent')+'">'+
             tip(r.label+' · '+cols[i]+': '+(cfg.tip?cfg.tip(v):v))+'</rect>'+
             '<text class="c-val" x="'+(x+cw/2)+'" y="'+(y+rh/2+4)+'" text-anchor="middle" fill="'+st.text+'">'+esc(cfg.fmt?cfg.fmt(v):v)+'</text>';
      });
    });
    return svg(w,h,g,cfg.label);
  };

  /* --------------------------------------------------- dispersão / bolhas */
  API.scatter = function (cfg){
    var w=cfg.w||720, h=cfg.h||300, p=pad(w,h,{l:56,b:46,r:24,t:20});
    var xMax=cfg.xMax, yMax=cfg.yMax, xMin=cfg.xMin||0, yMin=cfg.yMin||0;
    var X=function(v){ return p.l+(v-xMin)/(xMax-xMin)*p.iw; };
    var Y=function(v){ return p.t+p.ih-(v-yMin)/(yMax-yMin)*p.ih; };
    var g='', i;
    for(i=0;i<=4;i++){
      var yv=yMin+(yMax-yMin)*i/4, xv=xMin+(xMax-xMin)*i/4;
      g += '<line class="c-grid" x1="'+p.l+'" y1="'+Y(yv).toFixed(1)+'" x2="'+(p.l+p.iw)+'" y2="'+Y(yv).toFixed(1)+'"/>'+
           '<text class="c-lbl" x="'+(p.l-8)+'" y="'+(Y(yv)+4).toFixed(1)+'" text-anchor="end">'+esc((cfg.yfmt||n0)(yv))+'</text>'+
           '<text class="c-lbl" x="'+X(xv).toFixed(1)+'" y="'+(p.t+p.ih+18)+'" text-anchor="middle">'+esc((cfg.xfmt||n0)(xv))+'</text>';
    }
    if (cfg.xRef!=null) g += '<line class="c-target" x1="'+X(cfg.xRef).toFixed(1)+'" y1="'+p.t+'" x2="'+X(cfg.xRef).toFixed(1)+'" y2="'+(p.t+p.ih)+'"/>';
    if (cfg.yRef!=null) g += '<line class="c-target" x1="'+p.l+'" y1="'+Y(cfg.yRef).toFixed(1)+'" x2="'+(p.l+p.iw)+'" y2="'+Y(cfg.yRef).toFixed(1)+'"/>';
    cfg.points.forEach(function(pt){
      var r = pt.r || 6, c=col(pt.color);
      g += '<circle class="hit" cx="'+X(pt.x).toFixed(1)+'" cy="'+Y(pt.y).toFixed(1)+'" r="'+r+'" fill="'+c+'" opacity=".75" stroke="'+c+'">'+
           tip(pt.label)+'</circle>'+
           '<text class="c-lbl" x="'+X(pt.x).toFixed(1)+'" y="'+(Y(pt.y)-r-5).toFixed(1)+'" text-anchor="middle">'+esc(pt.short||'')+'</text>';
    });
    g += '<line class="c-axis" x1="'+p.l+'" y1="'+(p.t+p.ih)+'" x2="'+(p.l+p.iw)+'" y2="'+(p.t+p.ih)+'"/>'+
         '<line class="c-axis" x1="'+p.l+'" y1="'+p.t+'" x2="'+p.l+'" y2="'+(p.t+p.ih)+'"/>'+
         '<text class="c-lbl" x="'+(p.l+p.iw/2)+'" y="'+(h-6)+'" text-anchor="middle">'+esc(cfg.xLabel||'')+'</text>'+
         '<text class="c-lbl" x="'+14+'" y="'+(p.t+p.ih/2)+'" text-anchor="middle" transform="rotate(-90 14 '+(p.t+p.ih/2)+')">'+esc(cfg.yLabel||'')+'</text>';
    return svg(w,h,g,cfg.label);
  };

  /* --------------------------------------------------- funil */
  API.funnel = function (cfg){
    var w=cfg.w||520, rh=46, h=cfg.items.length*rh+20, max=cfg.items[0].v, g='';
    cfg.items.forEach(function(it,i){
      var bw=(it.v/max)*(w-190), x=(w-190-bw)/2+150, y=10+i*rh;
      var conv = i ? Math.round(it.v/cfg.items[i-1].v*100) : 100;
      g += '<text class="c-lbl" x="140" y="'+(y+24)+'" text-anchor="end">'+esc(it.etapa)+'</text>'+
           '<rect class="hit" x="'+x.toFixed(1)+'" y="'+y+'" width="'+Math.max(bw,2).toFixed(1)+'" height="34" rx="3" fill="'+C.blue+'" opacity="'+(1-i*0.14).toFixed(2)+'">'+
           tip(it.etapa+': '+it.v)+'</rect>'+
           '<text class="c-val" x="'+(x+bw/2).toFixed(1)+'" y="'+(y+22)+'" text-anchor="middle" fill="#fff">'+it.v+'</text>'+
           (i?'<text class="c-lbl" x="'+(w-8)+'" y="'+(y+22)+'" text-anchor="end">'+conv+'%</text>':'');
    });
    return svg(w,h,g,cfg.label);
  };

  /* --------------------------------------------------- gantt */
  API.gantt = function (cfg){
    var cols=cfg.cols, tasks=cfg.tasks, lw=132, cw=cfg.cw||62, rh=30;
    var w=lw+cols.length*cw+10, h=28+tasks.length*rh+10, g='';
    cols.forEach(function(c,i){
      g += '<text class="c-lbl" x="'+(lw+i*cw+cw/2)+'" y="16" text-anchor="middle">'+esc(c)+'</text>'+
           '<line class="c-grid" x1="'+(lw+i*cw)+'" y1="22" x2="'+(lw+i*cw)+'" y2="'+(h-8)+'"/>';
    });
    tasks.forEach(function(t,j){
      var y=28+j*rh, x=lw+t.ini*cw, bw=t.dur*cw;
      var c = t.status==='crit'?C.red : t.status==='warn'?C.amber : C.blue;
      g += '<text class="c-lbl" x="'+(lw-10)+'" y="'+(y+19)+'" text-anchor="end">'+esc(t.nome)+'</text>'+
           '<rect class="hit" x="'+x+'" y="'+(y+6)+'" width="'+bw+'" height="16" rx="3" fill="'+c+'" opacity=".85">'+
           tip(t.nome+' · '+(t.tip||''))+'</rect>';
      if (t.marco!=null){
        var mx=lw+t.marco*cw;
        g += '<path d="M'+mx+' '+(y+6)+' l8 8 l-8 8 l-8 -8 z" fill="'+C.ink+'">'+tip('Marco contratual')+'</path>';
      }
    });
    return svg(w,h,g,cfg.label);
  };

  /* --------------------------------------------------- bullet */
  API.bullet = function (cfg){
    var w=cfg.w||420, h=cfg.h||56, l=8, iw=w-16, g='';
    var max=cfg.max, X=function(v){ return l+v/max*iw; };
    var faixas = cfg.ranges || [];
    faixas.forEach(function(f){
      g += '<rect x="'+X(f.de).toFixed(1)+'" y="18" width="'+(X(f.ate)-X(f.de)).toFixed(1)+'" height="18" fill="'+col(f.color)+'" opacity=".16"/>';
    });
    g += '<rect x="'+l+'" y="24" width="'+(X(cfg.value)-l).toFixed(1)+'" height="6" rx="3" fill="'+col(cfg.color||'blue')+'"/>'+
         '<line x1="'+X(cfg.target).toFixed(1)+'" y1="14" x2="'+X(cfg.target).toFixed(1)+'" y2="40" stroke="'+C.ink+'" stroke-width="2"/>'+
         '<text class="c-lbl" x="'+l+'" y="12">'+esc(cfg.label||'')+'</text>'+
         '<text class="c-val" x="'+(w-8)+'" y="12" text-anchor="end">'+esc(cfg.valueLabel||cfg.value)+' · meta '+esc(cfg.targetLabel||cfg.target)+'</text>';
    for (var i=0;i<=4;i++){
      var v=max*i/4;
      g += '<text class="c-lbl" x="'+X(v).toFixed(1)+'" y="'+(h-4)+'" text-anchor="middle">'+esc((cfg.fmt||n0)(v))+'</text>';
    }
    return svg(w,h,g,cfg.aria||cfg.label);
  };

  /* --------------------------------------------------- gauge */
  API.gauge = function (cfg){
    var w=220,h=132, cx=110, cy=110, r=84, g='';
    function pt(v){ var a=Math.PI*(1 - v/cfg.max); return [cx+r*Math.cos(a), cy-r*Math.sin(a)]; }
    function arc(v0,v1,color,width){
      /* o arco cobre no máximo 180°, então nunca é large-arc */
      var a=pt(v0), b=pt(v1), large = 0;
      return '<path d="M'+a[0].toFixed(1)+' '+a[1].toFixed(1)+' A'+r+' '+r+' 0 '+large+' 1 '+b[0].toFixed(1)+' '+b[1].toFixed(1)+
             '" fill="none" stroke="'+color+'" stroke-width="'+(width||14)+'" stroke-linecap="butt"/>';
    }
    g += arc(0,cfg.max,'var(--bg-gray)');
    g += arc(0,cfg.value,col(cfg.color||'blue'));
    var t=pt(cfg.target);
    g += '<line x1="'+(cx+(r-12)*(t[0]-cx)/r).toFixed(1)+'" y1="'+(cy+(r-12)*(t[1]-cy)/r).toFixed(1)+'" x2="'+(cx+(r+10)*(t[0]-cx)/r).toFixed(1)+'" y2="'+(cy+(r+10)*(t[1]-cy)/r).toFixed(1)+'" stroke="'+C.ink+'" stroke-width="2"/>';
    g += '<text x="'+cx+'" y="'+(cy-14)+'" text-anchor="middle" class="c-val" style="font-size:26px" fill="var(--ink)">'+esc(cfg.valueLabel)+'</text>'+
         '<text x="'+cx+'" y="'+(cy+6)+'" text-anchor="middle" class="c-lbl">'+esc(cfg.label||'')+'</text>';
    return svg(w,h,g,cfg.label,'chart-gauge');
  };

  /* --------------------------------------------------- rosca */
  API.donut = function (cfg){
    var w=cfg.w||220, h=220, cx=w/2, cy=110, r=84, ir=52, g='';
    var tot=cfg.slices.reduce(function(a,s){ return a+s.v; },0), ang=-Math.PI/2;
    cfg.slices.forEach(function(s){
      var a2=ang + (s.v/tot)*Math.PI*2, large=(a2-ang)>Math.PI?1:0;
      var x1=cx+r*Math.cos(ang), y1=cy+r*Math.sin(ang), x2=cx+r*Math.cos(a2), y2=cy+r*Math.sin(a2);
      var x3=cx+ir*Math.cos(a2), y3=cy+ir*Math.sin(a2), x4=cx+ir*Math.cos(ang), y4=cy+ir*Math.sin(ang);
      g += '<path class="hit" d="M'+x1.toFixed(1)+' '+y1.toFixed(1)+' A'+r+' '+r+' 0 '+large+' 1 '+x2.toFixed(1)+' '+y2.toFixed(1)+
           ' L'+x3.toFixed(1)+' '+y3.toFixed(1)+' A'+ir+' '+ir+' 0 '+large+' 0 '+x4.toFixed(1)+' '+y4.toFixed(1)+' Z" fill="'+col(s.color)+'">'+
           tip(s.rot+': '+Math.round(s.v/tot*100)+'%')+'</path>';
      ang=a2;
    });
    g += '<text x="'+cx+'" y="'+(cy+5)+'" text-anchor="middle" class="c-val" style="font-size:15px">'+esc(cfg.centro||'')+'</text>';
    return svg(w,h,g,cfg.label);
  };

  /* --------------------------------------------------- radar */
  API.radar = function (cfg){
    var w=cfg.w||300,h=300,cx=w/2,cy=150,r=110,ax=cfg.axes,n=ax.length,g='';
    function P(i,v){ var a=-Math.PI/2 + i*2*Math.PI/n; return [cx+r*v/100*Math.cos(a), cy+r*v/100*Math.sin(a)]; }
    [25,50,75,100].forEach(function(lv){
      var d=''; for(var i=0;i<n;i++){ var p=P(i,lv); d += (i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)+' '; }
      g += '<path d="'+d+'Z" fill="none" class="c-grid"/>';
    });
    for(var i=0;i<n;i++){
      var p=P(i,118);
      g += '<text class="c-lbl" x="'+p[0].toFixed(1)+'" y="'+p[1].toFixed(1)+'" text-anchor="middle">'+esc(ax[i])+'</text>';
    }
    cfg.series.forEach(function(se){
      var d=''; se.values.forEach(function(v,i){ var p=P(i,v); d += (i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)+' '; });
      g += '<path d="'+d+'Z" fill="'+col(se.color)+'" opacity=".14"/><path d="'+d+'Z" fill="none" stroke="'+col(se.color)+'" stroke-width="2"/>';
    });
    return svg(w,h,g,cfg.label);
  };

  /* --------------------------------------------------- sparkline */
  API.spark = function (values, color, wid){
    var w=wid||96,h=26,min=Math.min.apply(null,values),max=Math.max.apply(null,values),d='';
    values.forEach(function(v,i){
      var x=i*(w/(values.length-1)), y=h-2-((v-min)/((max-min)||1))*(h-6);
      d += (i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)+' ';
    });
    return '<svg class="chart kpi-spark" viewBox="0 0 '+w+' '+h+'" width="'+w+'" height="'+h+'" aria-hidden="true">'+
           '<path d="'+d+'" fill="none" stroke="'+col(color)+'" stroke-width="1.6"/></svg>';
  };

  /* --------------------------------------------------- legenda */
  API.legend = function (items){
    return '<div class="legend">'+items.map(function(i){
      return '<span><i style="background:'+col(i.color)+(i.light?';opacity:.45':'')+'"></i>'+esc(i.name)+'</span>';
    }).join('')+'</div>';
  };

  API.fmt = { n0:n0, n1:n1, pct:function(v){ return n1(v)+'%'; }, mil:function(v){ return n0(v); } };
  return API;
})();
