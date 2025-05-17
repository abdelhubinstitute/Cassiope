// Simple client-side logic for AI Article Workflow
const state={
  title:null,
  research:null,
  outline:null,
  draft:null,
  critique:null,
  revision:null,
  imageUrl:null,
  html:null,
  topics:[]
};

// Utilities
function getKeys(){
  return {
    openai:localStorage.getItem('openaiKey')||document.getElementById('openaiKey').value.trim(),
    fal:localStorage.getItem('falKey')||document.getElementById('falKey').value.trim()
  };}

function saveKeys(){
  const key=document.getElementById('openaiKey').value.trim();
  const fal=document.getElementById('falKey').value.trim();
  if(!key){alert('Enter OpenAI key');return;}
  localStorage.setItem('openaiKey',key);
  if(fal){localStorage.setItem('falKey',fal);}
  // validate key via backend
  fetch('/api/validate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({apiKey:key})})
    .then(r=>r.json())
    .then(d=>{
      if(d.ok){
        document.getElementById('keysSaved').style.display='inline';
        document.getElementById('keysSaved').style.color='green';
        document.getElementById('keysSaved').textContent='✔ Valid key saved';
      }else{
        document.getElementById('keysSaved').style.display='inline';
        document.getElementById('keysSaved').style.color='red';
        document.getElementById('keysSaved').textContent='Invalid API key';
      }
    }).catch(()=>{
      document.getElementById('keysSaved').style.display='inline';
      document.getElementById('keysSaved').style.color='red';
      document.getElementById('keysSaved').textContent='Key check failed';
    });
}

function show(id){document.getElementById(id).classList.remove('hidden');}
function hide(id){document.getElementById(id).classList.add('hidden');}
function clearList(el){while(el.firstChild)el.removeChild(el.firstChild);} 

// Global loading overlay
const loader=document.createElement('div');
loader.id='globalLoader';
loader.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(255,255,255,0.7);display:none;align-items:center;justify-content:center;font-size:1.5rem;z-index:9999';
loader.textContent='Loading...';
document.body.appendChild(loader);
function showLoader(){loader.style.display='flex';}
function hideLoader(){loader.style.display='none';}

// Wrap fetch helper to show loader
async function doFetch(url,options){
  try{showLoader();return await fetch(url,options);}finally{hideLoader();}
}

// Step 1: Titles
async function generateTitles(){
  const theme=document.getElementById('theme').value.trim();
  const {openai}=getKeys();
  if(!theme||!openai){alert('Need theme and OpenAI key');return;}
  const systemPrompt=document.getElementById('titleSystemPrompt').value.trim();
  const userPrompt=document.getElementById('titleUserPrompt').value.trim();
  const res=await doFetch('/api/title',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({theme,apiKey:openai,systemPrompt:systemPrompt||undefined,prompt:userPrompt||undefined})});
  const data=await res.json();
  const list=document.getElementById('titleList');
  clearList(list);
  data.titles.forEach(t=>{
    const li=document.createElement('li');li.textContent=t;li.onclick=()=>{state.title=t;[...list.children].forEach(x=>x.classList.remove('selected'));li.classList.add('selected');show('step-topics');};list.appendChild(li);
  });
}

// Step 2: Generate Search Topics
async function generateTopics(){
  const {openai}=getKeys();
  if(!state.title||!openai){alert('Need title and OpenAI key');return;}
  const systemPrompt=document.getElementById('topicsSystemPrompt').value.trim();
  const userPrompt=document.getElementById('topicsUserPrompt').value.trim();
  const btn=event.target;btn.disabled=true;btn.textContent='Working...';
  const res=await doFetch('/api/topics',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:state.title,apiKey:openai,systemPrompt:systemPrompt||undefined,prompt:userPrompt||undefined})});
  const data=await res.json();
  state.topics=data.topics;
  renderTopics();
  btn.disabled=false;btn.textContent='Generate Topics';
  show('step-topics');
}

function renderTopics(){
  const list=document.getElementById('topicsList');
  clearList(list);
  state.topics.forEach((topic,idx)=>{
    const li=document.createElement('li');
    li.textContent=topic;
    li.onclick=()=>{li.classList.toggle('selected');};
    list.appendChild(li);
  });
}

function addCustomTopic(){
  const input=document.getElementById('customTopic');
  const val=input.value.trim();
  if(val){state.topics.push(val);renderTopics();input.value='';}
}

// Step 3: Research using selected topics
async function generateResearch(){
  const {openai}=getKeys();
  const selected=[...document.querySelectorAll('#topicsList li.selected')].map(li=>li.textContent.trim());
  const topicsArr=selected.length?selected:state.topics;
  if(topicsArr.length===0){alert('Select at least one topic');return;}
  const systemPrompt=document.getElementById('researchSystemPrompt').value.trim();
  const btn=document.getElementById('generateResearchBtn');
  btn.disabled=true;btn.textContent='Working...';
  const res=await doFetch('/api/research',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({topics:topicsArr,apiKey:openai,systemPrompt:systemPrompt||undefined})});
  const data=await res.json();
  state.research=data.research;
  document.getElementById('researchOut').textContent=data.research;
  btn.disabled=false;btn.textContent='Generate Research';
  show('step-outline');
}

// Step 4: Outlines
async function generateOutlines(){
  const {openai}=getKeys();
  if(!state.title||!state.research||!openai){alert('Need previous steps');return;}
  const systemPrompt=document.getElementById('outlineSystemPrompt').value.trim();
  const userPrompt=document.getElementById('outlineUserPrompt').value.trim();
  const btn=event.target;btn.disabled=true;btn.textContent='Working...';
  const res=await doFetch('/api/outline',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:state.title,research:state.research,apiKey:openai,systemPrompt:systemPrompt||undefined,prompt:userPrompt||undefined})});
  const data=await res.json();
  const list=document.getElementById('outlineList');clearList(list);
  data.outlines.forEach(o=>{const li=document.createElement('li');li.textContent=o;li.onclick=()=>{state.outline=o;[...list.children].forEach(x=>x.classList.remove('selected'));li.classList.add('selected');show('step-draft');};list.appendChild(li);});
  btn.disabled=false;btn.textContent='Generate Outlines';
}

// Step 5: Draft
async function generateDraft(){
  const {openai}=getKeys();
  if(!state.title||!state.research||!state.outline){alert('Need previous steps');return;}
  const systemPrompt=document.getElementById('draftSystemPrompt').value.trim();
  const userPrompt=document.getElementById('draftUserPrompt').value.trim();
  const btn=event.target;btn.disabled=true;btn.textContent='Working...';
  const res=await doFetch('/api/draft',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:state.title,research:state.research,outline:state.outline,apiKey:openai,systemPrompt:systemPrompt||undefined,prompt:userPrompt||undefined})});
  const data=await res.json();
  state.draft=data.draft;
  document.getElementById('draftOut').textContent=data.draft;
  btn.disabled=false;btn.textContent='Generate Draft';
}

// Step 6: Critiques
async function generateCritiques(){
  const {openai}=getKeys();
  const feedback=document.getElementById('userFeedback').value.trim();
  if(!state.draft){alert('Generate draft first');return;}
  const systemPrompt=document.getElementById('critiqueSystemPrompt').value.trim();
  const userPrompt=document.getElementById('critiqueUserPrompt').value.trim();
  const btn=event.target;btn.disabled=true;btn.textContent='Working...';
  const res=await doFetch('/api/critique',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({draft:state.draft,userFeedback:feedback||'No feedback provided',apiKey:openai,systemPrompt:systemPrompt||undefined,prompt:userPrompt||undefined})});
  const data=await res.json();
  const list=document.getElementById('critiqueList');clearList(list);
  data.critiques.forEach(c=>{const li=document.createElement('li');li.textContent=c;li.onclick=()=>{state.critique=c;[...list.children].forEach(x=>x.classList.remove('selected'));li.classList.add('selected');show('step-revision');};list.appendChild(li);});
  btn.disabled=false;btn.textContent='Generate Critiques';
  show('step-critique');
}

// Step 7: Revision
async function generateRevision(){
  const {openai}=getKeys();
  if(!state.critique){alert('Select critique');return;}
  const systemPrompt=document.getElementById('revisionSystemPrompt').value.trim();
  const userPrompt=document.getElementById('revisionUserPrompt').value.trim();
  const btn=event.target;btn.disabled=true;btn.textContent='Working...';
  const res=await doFetch('/api/revision',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:state.title,research:state.research,outline:state.outline,draft:state.draft,critique:state.critique,apiKey:openai,systemPrompt:systemPrompt||undefined,prompt:userPrompt||undefined})});
  const data=await res.json();
  state.revision=data.revision;
  document.getElementById('revisionOut').textContent=data.revision;
  btn.disabled=false;btn.textContent='Generate Final Article';
  show('step-image');
}

// Step 8: Image
async function generateImage(){
  const {openai}=getKeys();
  if(!state.revision){alert('Generate revised article first');return;}
  const imgPromptInput=document.getElementById('imagePromptInput').value.trim();
  const systemPrompt=document.getElementById('imageSystemPrompt').value.trim();
  const btn=event.target;btn.disabled=true;btn.textContent='Working...';
  const res=await doFetch('/api/image',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({article:state.revision,prompt:imgPromptInput||undefined,systemPrompt:systemPrompt||undefined,apiKey:openai,falKey:getKeys().fal})});
  const data=await res.json();
  state.imageUrl=data.imageUrl;
  document.getElementById('featuredImg').src=data.imageUrl;
  document.getElementById('featuredImg').style.display='block';
  document.getElementById('downloadImageBtn').classList.remove('hidden');
  document.getElementById('imagePromptOut').textContent=data.imagePrompt;
  btn.disabled=false;btn.textContent='Generate Image';
  show('step-html');
}

// Step 9: HTML
async function generateHTML(){
  const {openai}=getKeys();
  if(!state.revision||!state.imageUrl){alert('Need article and image');return;}
  const systemPrompt=document.getElementById('htmlSystemPrompt').value.trim();
  const userPrompt=document.getElementById('htmlUserPrompt').value.trim();
  const btn=event.target;btn.disabled=true;btn.textContent='Working...';
  const payload={article:state.revision,apiKey:openai,systemPrompt:systemPrompt||undefined,prompt:userPrompt||undefined};
  if(state.imageUrl && !state.imageUrl.startsWith('data:')){payload.imageUrl=state.imageUrl;}
  const res=await doFetch('/api/html',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  const data=await res.json();
  state.html=data.html;
  document.getElementById('htmlOut').value=data.html;
  btn.disabled=false;btn.textContent='Generate HTML';
  show('downloadHtmlBtn');
}

function downloadHTML(){
  if(!state.html){alert('No HTML generated');return;}
  const blob=new Blob([state.html],{type:'text/html'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download='article.html';
  a.click();
  URL.revokeObjectURL(url);
}

function downloadImage(){
  if(!state.imageUrl){alert('No image yet');return;}
  const link=document.createElement('a');
  link.href=state.imageUrl;
  link.download='featured.png';
  link.click();
} 