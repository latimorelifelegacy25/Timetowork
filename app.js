(function(){
  const openBtn = document.getElementById('openChat');
  const modal = document.getElementById('chatModal');
  const overlay = document.getElementById('chatOverlay');
  const closeBtn = document.getElementById('closeChat');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatText');
  const log = document.getElementById('chatLog');
  const copyBtn = document.getElementById('copyLinkBtn');
  const saveBtn = document.getElementById('saveContactBtn');

  const API_PATH = "/api/strategic-advisor";

  function openModal(){
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden','false');
    setTimeout(()=>input.focus(), 50);
  }
  function closeModal(){
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden','true');
  }
  openBtn.addEventListener('click', openModal);
  overlay.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);

  copyBtn.addEventListener('click', async ()=>{
    try{
      await navigator.clipboard.writeText(window.location.href);
      copyBtn.textContent = "Copied!";
      setTimeout(()=>copyBtn.textContent="Copy Link", 1200);
    }catch(e){
      copyBtn.textContent = "Copy failed";
      setTimeout(()=>copyBtn.textContent="Copy Link", 1200);
    }
  });

  saveBtn.addEventListener('click', ()=>{
    // Simple vCard download
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Latimore;Jackson;;;",
      "FN:Jackson M. Latimore Sr.",
      "ORG:Latimore Life & Legacy LLC",
      "TITLE:Founder & CEO",
      "EMAIL;TYPE=INTERNET:latimorelifeandlegacy@gmail.com",
      "NOTE:Protecting Today. Securing Tomorrow. #TheBeatGoesOn",
      "END:VCARD"
    ].join("\n");

    const blob = new Blob([vcard], {type:"text/vcard"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Jackson-Latimore.vcf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  function addMsg(role, text){
    const wrap = document.createElement('div');
    wrap.className = 'msg ' + (role === 'user' ? 'msg--user' : 'msg--bot');
    const label = document.createElement('div');
    label.className = 'msg__label';
    label.textContent = role === 'user' ? 'You' : 'Legacy AI';
    const body = document.createElement('div');
    body.className = 'msg__body';
    body.textContent = text;
    wrap.appendChild(label);
    wrap.appendChild(body);
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
  }

  async function sendToAI(message){
    const res = await fetch(API_PATH, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ message })
    });
    if(!res.ok){
      const errText = await res.text().catch(()=> "");
      throw new Error("AI request failed: " + res.status + " " + errText);
    }
    const data = await res.json();
    return data.reply || "I’m having trouble answering right now. Try again in a minute.";
  }

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const message = (input.value || "").trim();
    if(!message) return;
    input.value = "";
    addMsg('user', message);

    const thinking = "Got it — let me think through that with you…";
    addMsg('bot', thinking);

    try{
      const reply = await sendToAI(message);
      // replace the last bot message (thinking)
      const msgs = log.querySelectorAll('.msg--bot .msg__body');
      if(msgs.length) msgs[msgs.length-1].textContent = reply;
    }catch(err){
      const msgs = log.querySelectorAll('.msg--bot .msg__body');
      if(msgs.length) msgs[msgs.length-1].textContent =
        "I’m having trouble connecting right now. If you want, send a secure email and we’ll take care of you.";
    }
  });
})();