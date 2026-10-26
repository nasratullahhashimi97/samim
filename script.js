
const toggle=document.getElementById('menuToggle');
const sidebar=document.getElementById('sidebar');
if(toggle&&sidebar) toggle.addEventListener('click',()=>sidebar.classList.toggle('open'));
document.querySelectorAll('[data-demo-form]').forEach(form=>form.addEventListener('submit',e=>{
 e.preventDefault();const m=form.querySelector('[data-form-message]');
 if(m)m.textContent='Demo only: this form is not connected to a live account system yet.';
}));
const videoBtn=document.getElementById('videoBtn'),audioBtn=document.getElementById('audioBtn');
const callArea=document.getElementById('callArea'),localVideo=document.getElementById('localVideo'),callStatus=document.getElementById('callStatus');
let stream=null,audioOnly=false,muted=false,cameraOff=false;
async function startMedia(onlyAudio){
 if(!navigator.mediaDevices?.getUserMedia){if(callStatus)callStatus.textContent='Camera and microphone require HTTPS or localhost.';return;}
 try{
  if(stream)stream.getTracks().forEach(t=>t.stop());
  audioOnly=onlyAudio;stream=await navigator.mediaDevices.getUserMedia({audio:true,video:!onlyAudio});
  callArea?.classList.remove('hidden');
  if(localVideo){localVideo.srcObject=stream;localVideo.classList.toggle('hidden',onlyAudio);}
  if(callStatus)callStatus.textContent=onlyAudio?'Microphone test active. This is not a call with another person.':'Camera preview active. This is not a call with another person.';
  document.getElementById('cameraBtn')?.classList.toggle('hidden',onlyAudio);
 }catch(e){if(callStatus)callStatus.textContent='Could not access the device. Check browser permissions.';console.error(e);}
}
videoBtn?.addEventListener('click',()=>startMedia(false));audioBtn?.addEventListener('click',()=>startMedia(true));
document.getElementById('muteBtn')?.addEventListener('click',e=>{if(!stream)return;muted=!muted;stream.getAudioTracks().forEach(t=>t.enabled=!muted);e.currentTarget.textContent=muted?'Unmute microphone':'Mute microphone';});
document.getElementById('cameraBtn')?.addEventListener('click',e=>{if(!stream||audioOnly)return;cameraOff=!cameraOff;stream.getVideoTracks().forEach(t=>t.enabled=!cameraOff);e.currentTarget.textContent=cameraOff?'Turn camera on':'Turn camera off';});
document.getElementById('stopBtn')?.addEventListener('click',()=>{if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;if(localVideo)localVideo.srcObject=null;callArea?.classList.add('hidden');if(callStatus)callStatus.textContent='Preview ended.';});
