// Minimal dependency-free PNG writer + the Nightform mark: four city organisms on black.
import zlib from "node:zlib";

const TBL = (()=>{const t=new Int32Array(256);for(let n=0;n<256;n++){let c=n;
  for(let k=0;k<8;k++) c = c&1 ? 0xEDB88320 ^ (c>>>1) : c>>>1; t[n]=c;} return t;})();
const crc32 = b => { let c=-1; for(let i=0;i<b.length;i++) c = TBL[(c^b[i])&0xFF] ^ (c>>>8); return (c^-1)>>>0; };
function chunk(type, data){
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length,0);
  const td = Buffer.concat([Buffer.from(type,"latin1"), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td),0);
  return Buffer.concat([len, td, crc]);
}
function png(w,h,rgba){
  const stride = w*4+1, raw = Buffer.alloc(stride*h);
  for(let y=0;y<h;y++){ raw[y*stride]=0; rgba.copy(raw, y*stride+1, y*w*4, (y+1)*w*4); }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w,0); ihdr.writeUInt32BE(h,4);
  ihdr[8]=8; ihdr[9]=6; ihdr[10]=0; ihdr[11]=0; ihdr[12]=0;
  return Buffer.concat([
    Buffer.from([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]),
    chunk("IHDR",ihdr), chunk("IDAT", zlib.deflateSync(raw,{level:9})), chunk("IEND",Buffer.alloc(0))
  ]);
}

// four organisms, in the four city colours
const ORG = [
  {x:.31,y:.30,r:.163,c:[222,187,46]},              // amsterdam yellow
  {x:.70,y:.29,r:.155,c:[206,50,58]},               // london red
  {x:.29,y:.70,r:.155,c:[26,29,35], rim:[168,182,198]}, // berlin — void, rim-lit
  {x:.69,y:.71,r:.163,c:[48,100,214]}               // paris blue
];
export function icon(S){
  const px = Buffer.alloc(S*S*4);
  for(let y=0;y<S;y++) for(let x=0;x<S;x++){
    const u=x/S, v=y/S;
    let r=5,g=5,b=6;
    for(const o of ORG){
      const d = Math.hypot(u-o.x, v-o.y);
      const core = Math.max(0, 1 - Math.pow(d/o.r, 6));        // soft-edged body
      const glow = Math.max(0, 1 - d/(o.r*2.4)) ** 2 * 0.34;   // halo
      const k = Math.min(1, core + glow);
      r += o.c[0]*k; g += o.c[1]*k; b += o.c[2]*k;
      if(o.rim){                                                // cold edge, so the void reads
        const e = Math.exp(-Math.pow((d-o.r*0.94)/(o.r*0.085), 2));
        r += o.rim[0]*e; g += o.rim[1]*e; b += o.rim[2]*e;
      }
    }
    const i=(y*S+x)*4;
    px[i]=Math.min(255,r); px[i+1]=Math.min(255,g); px[i+2]=Math.min(255,b); px[i+3]=255;
  }
  return png(S,S,px);
}
